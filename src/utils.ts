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

export const TIMEOUT_DEFAULT_UNREF = true

export function sleep(milliseconds: number, unref: undefined | boolean = TIMEOUT_DEFAULT_UNREF): Promise<void> {
  return new Promise((resolve) => {
    const timer = setTimeout(resolve, milliseconds)

    if (unref) {
      Deno.unrefTimer(timer)
    }
  })
}

export function defer({ ms, unref = TIMEOUT_DEFAULT_UNREF, handle }: {
  ms: number
  unref?: undefined | boolean
  handle: () => void | Promise<void>
}): Promise<void> {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      try {
        const result = handle()

        if (result instanceof Promise) {
          result.then(() => resolve()).catch(reject)
        } else {
          resolve()
        }
      } catch (error) {
        reject(error)
      }
    }, ms)

    if (unref) {
      Deno.unrefTimer(timer)
    }
  })
}
