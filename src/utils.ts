export function urlJoin(base: string | URL, ...paths: ReadonlyArray<undefined | string>): URL {
  let url = new URL(base)

  for (const path of paths) {
    if (path === undefined) {
      continue
    }

    const nextBase = url.href.endsWith('/') ? url.href : `${url.href}/`
    const nextPath = path.startsWith('/') ? path.slice(1) : path

    url = new URL(nextPath, nextBase)
  }

  return url
}

export function extractKeys<T extends object>(object: T): ReadonlyArray<keyof T> {
  return Object.keys(object) as unknown as ReadonlyArray<keyof T>
}

export function extractValues<T extends object>(
  object: {
    readonly [K in keyof T]: T[K]
  },
): ReadonlyArray<T[keyof T]> {
  return Object.values<T[keyof T]>(object)
}

export function extractEntries<T extends Record<keyof never, unknown>>(
  object: {
    readonly [K in keyof T]: T[K]
  },
): ReadonlyArray<{ readonly [K in keyof T]: readonly [K, T[K]] }[keyof T]> {
  return Object.entries(object)
}

export function fromEntries<T extends readonly [keyof never, unknown]>(
  entries: readonly T[],
): { readonly [key in T[0]]: Extract<T, readonly [key, unknown]>[1] } {
  return Object.fromEntries(entries) as { readonly [key in T[0]]: Extract<T, readonly [key, unknown]>[1] }
}

export class Timeout<T = undefined> extends Promise<undefined | T> implements Disposable {
  /** The default value for unref. `true` by default and will unref the timer */
  static unref = true

  /** Create a timeout that resolves after a certain amount of time */
  static wait(timeout: number): Timeout<void> {
    return new this(timeout)
  }

  /** Create a timeout that resolves with a value after a certain amount of time */
  static defer<T>(timeout: number, deferred: (signal: AbortSignal) => T | Promise<T>): Timeout<T> {
    return new this(timeout, deferred)
  }

  /** Create a timeout that resolves with a value within a certain amount of time */
  static run<T>(timeout: number, handle: (signal: AbortSignal) => T | Promise<T>): Timeout<T> {
    const instance = new this<T>(timeout)

    try {
      const maybePromise = handle(instance.signal)

      if (maybePromise instanceof Promise) {
        maybePromise.then(instance.#resolve).catch(instance.#reject)
      } else {
        instance.#resolve(maybePromise)
      }
    } catch (error) {
      instance.#reject(error)
    }

    return instance
  }

  readonly #timer: number

  #status: 'in-progress' | 'fulfilled' | 'rejected' | 'aborted' | 'cancelled' = 'in-progress'

  get status(): 'in-progress' | 'fulfilled' | 'rejected' | 'aborted' | 'cancelled' {
    return this.#status
  }

  #controller: undefined | AbortController

  get signal(): AbortSignal {
    if (this.#controller === undefined) {
      const controller = new AbortController()

      if (this.#status !== 'in-progress' && (this.#status === 'rejected' || this.#status === 'aborted')) {
        controller.abort()
      } else {
        const listener = () => {
          if (this.#status === 'in-progress') {
            this.#status = 'aborted'
          }

          this.#resolve(undefined as T)

          controller.signal.removeEventListener('abort', listener)
        }

        controller.signal.addEventListener('abort', listener)
      }

      this.#controller = controller
    }

    return this.#controller.signal
  }

  protected constructor(
    timeout: number,
    handle?: undefined | ((signal: AbortSignal) => T | Promise<T>),
    unref: undefined | boolean = Timeout.unref,
  ) {
    let superResolve: undefined | ((value: undefined | T) => void) = undefined
    let superReject: undefined | ((reason: unknown) => void) = undefined

    super((resolve, reject) => {
      superResolve = resolve
      superReject = reject
    })

    this.#resolve = (value: undefined | T): void => {
      clearTimeout(this.#timer)

      if (this.#status === 'in-progress') {
        this.#status = 'fulfilled'
      }

      superResolve!(value)

      if (this.#controller !== undefined && this.#controller.signal.aborted === false && this.#status === 'aborted') {
        this.#controller.abort()
      }
    }

    this.#reject = (reason: unknown): void => {
      clearTimeout(this.#timer)

      if (this.#status === 'in-progress') {
        this.#status = 'rejected'
      }

      superReject!(reason)

      if (
        this.#controller !== undefined && this.#controller.signal.aborted === false &&
        (this.#status === 'rejected' || this.#status === 'aborted')
      ) {
        this.#controller.abort()
      }
    }

    const handler: TimerHandler = handle === undefined ? () => this.#resolve(undefined as T) : () => {
      if (this.#status !== 'in-progress') {
        return this.#resolve(undefined as T)
      }

      try {
        const maybePromise = handle(this.signal)

        if (maybePromise instanceof Promise) {
          maybePromise.then(this.#resolve).catch(this.#reject)
        } else {
          this.#resolve(maybePromise)
        }
      } catch (error) {
        if (error instanceof Error && error.name === 'AbortError') {
          if (this.#status === 'in-progress') {
            this.#status = 'aborted'
          }

          return this.#resolve(undefined)
        }

        this.#reject(error)
      }
    }

    this.#timer = setTimeout(handler, timeout)

    if (unref) {
      this.unref()
    }
  }

  #resolve: (value: undefined | T) => void
  #reject: (reason: unknown) => void;

  [Symbol.dispose](): void {
    this.cancel()
  }

  /** Abort the timeout by emitting 'abort' to its signal and resolving to undefined */
  abort(): void {
    if (this.#status === 'in-progress') {
      this.#status = 'aborted'
    }

    this.#resolve(undefined as T)
  }

  /** Cancel the timeout by resolving to undefined */
  cancel(): void {
    if (this.#status === 'in-progress') {
      this.#status = 'cancelled'
    }

    this.#resolve(undefined as T)
  }

  /** Unref the timer */
  unref(): this {
    Deno.unrefTimer(this.#timer)

    return this
  }
}

export function ensureError(error: unknown): Error {
  return error instanceof Error
    ? error
    : new Error(typeof error === 'string' ? error : 'Unknown error', { cause: error })
}

export function mergeAbortSignals(
  signal1: undefined | AbortSignal,
  signal2: undefined | AbortSignal,
): undefined | AbortSignal {
  if (signal1 === undefined) {
    return signal2
  }

  if (signal2 === undefined) {
    return signal1
  }

  if (signal1.aborted === true) {
    return signal1
  }

  if (signal2.aborted === true) {
    return signal2
  }

  const mergedController = new AbortController()

  const listener1 = () => {
    if (mergedController.signal.aborted === false) {
      mergedController.abort()
    }

    signal1.removeEventListener('abort', listener1)
  }

  const listener2 = () => {
    if (mergedController.signal.aborted === false) {
      mergedController.abort()
    }

    signal2.removeEventListener('abort', listener2)
  }

  signal1.addEventListener('abort', listener1)
  signal2.addEventListener('abort', listener2)

  return mergedController.signal
}

export type JSONType =
  | JSONPrimitiveType
  | JSONArray
  | JSONReadonlyArray
  | JSONObject
  | JSONReadonlyObject

export type JSONPrimitiveType = null | undefined | boolean | number | string
export interface JSONArray extends Array<JSONType> {}
export interface JSONReadonlyArray extends ReadonlyArray<JSONType> {}
export type JSONObject = { [key: string]: JSONType }
export type JSONReadonlyObject = { readonly [key: string]: JSONType }
