import { assertReturn, type Guard } from 'https://raw.githubusercontent.com/systematic-trader/type-guard/main/mod.ts'
import { ensureError } from '../utils/error.ts'
import { stringifyJSON } from '../utils/json.ts'
import { mergeAbortSignals } from '../utils/signal.ts'
import { Timeout } from '../utils/timeout.ts'

export interface HTTPClientOnErrorHandler {
  (error: Error, retries: number): void | Promise<void>
}

export abstract class HTTPError extends Error {
  readonly statusCode: number
  readonly statusText: string

  constructor(message: HTTPError['message'], statusCode: HTTPError['statusCode'], statusText: HTTPError['statusText']) {
    super(message)
    this.statusCode = statusCode
    this.statusText = statusText

    this.name = 'HTTPError'
  }
}

export class HTTPClientError extends HTTPError {
  readonly method: 'GET' | 'POST' | 'PUT' | 'DELETE'
  readonly href: string
  readonly headers: Record<string, string>
  readonly body: unknown

  constructor(
    method: HTTPClientError['method'],
    href: string,
    statusCode: HTTPClientError['statusCode'],
    statusText: HTTPClientError['statusText'],
    body: HTTPClientError['body'],
    headers: HTTPClientError['headers'],
  ) {
    let message = `${statusCode} ${statusText} - ${method} ${href}`

    if (typeof body === 'string') {
      message = `${message}\n${body}`
    }

    if (typeof body === 'object' && body !== null) {
      message = `${message}\n${stringifyJSON(body, undefined, 2)}`
    }

    super(message, statusCode, statusText)
    this.body = body
    this.href = href
    this.method = method
    this.headers = headers

    this.name = 'HTTPClientError'
  }
}

export class HTTPClientRequestAbortError extends Error {
  readonly method: 'GET' | 'POST' | 'PUT' | 'DELETE'
  readonly href: string

  constructor(
    method: HTTPClientRequestAbortError['method'],
    href: HTTPClientRequestAbortError['href'],
  ) {
    super(`Aborted ${method} ${href}`)
    this.method = method
    this.href = href

    this.name = 'HTTPClientRequestAbortError'
  }
}

export class HTTPServiceError extends HTTPError {
  readonly body: unknown

  constructor(
    statusCode: HTTPServiceError['statusCode'],
    statusText: HTTPServiceError['statusText'],
    body: HTTPServiceError['body'],
  ) {
    let message = `${statusCode} ${statusText}`

    if (typeof body === 'string') {
      message = `${message}\n${body}`
    }

    if (typeof body === 'object' && body !== null) {
      message = `${message}\n${stringifyJSON(body, undefined, 2)}`
    }

    super(message, statusCode, statusText)
    this.body = body

    this.name = 'HTTPServiceError'
  }
}

export type HTTPClientHeaders = Record<string, undefined | string> | Headers

export class HTTPClient {
  #createHeaders: () => Headers | Promise<Headers>

  constructor({ headers }: {
    readonly headers?:
      | undefined
      | HTTPClientHeaders
      | (() => undefined | HTTPClientHeaders | Promise<undefined | HTTPClientHeaders>)
  } = {}) {
    this.#createHeaders = typeof headers === 'function'
      ? async () => mergeHeaders(new Headers(), await headers())
      : () => mergeHeaders(new Headers(), headers)
  }

  async loadHeaders(): Promise<Headers> {
    return await this.#createHeaders()
  }

  async get(
    url: string | URL,
    {
      headers,
      signal,
      timeout,
      onError,
    }: {
      readonly headers?: undefined | HTTPClientHeaders
      readonly signal?: undefined | AbortSignal
      readonly timeout?: undefined | number
      readonly onError?: undefined | HTTPClientOnErrorHandler
    } = {},
  ): Promise<Response> {
    return await fetchResponse(this, url, {
      method: 'GET',
      headers,
      signal,
      timeout,
      onError,
    })
  }

  async getOkJSON<T = unknown>(
    url: string | URL,
    {
      guard,
      headers,
      coerce,
      signal,
      timeout,
      onError,
    }: {
      readonly guard?: undefined | Guard<T>
      readonly headers?: undefined | HTTPClientHeaders
      readonly coerce?: undefined | ((body: unknown) => unknown)
      readonly signal?: undefined | AbortSignal
      readonly timeout?: undefined | number
      readonly onError?: undefined | HTTPClientOnErrorHandler
    } = {},
  ): Promise<T> {
    const response = await fetchOkResponse(this, url, {
      method: 'GET',
      headers: mergeHeaders(
        { 'accept': 'application/json' },
        headers,
      ),
      signal,
      timeout,
      onError,
    })

    // console.log(response.headers)

    let body = await response?.json()

    if (coerce !== undefined) {
      body = coerce(body)
    }

    if (guard !== undefined) {
      return assertReturn(guard, body)
    }

    return body
  }

  async getOkBlob(
    url: string | URL,
    {
      headers,
      signal,
      timeout,
      onError,
    }: {
      readonly headers?: undefined | HTTPClientHeaders
      readonly signal?: undefined | AbortSignal
      readonly timeout?: undefined | number
      readonly onError?: undefined | HTTPClientOnErrorHandler
    } = {},
  ): Promise<Blob> {
    const response = await fetchOkResponse(this, url, {
      method: 'GET',
      headers,
      signal,
      timeout,
      onError,
    })

    return await response.blob()
  }

  async getOkText(
    url: string | URL,
    {
      headers,
      signal,
      timeout,
      onError,
    }: {
      readonly headers?: undefined | HTTPClientHeaders
      readonly signal?: undefined | AbortSignal
      readonly timeout?: undefined | number
      readonly onError?: undefined | HTTPClientOnErrorHandler
    } = {},
  ): Promise<string> {
    const response = await fetchOkResponse(this, url, {
      method: 'GET',
      headers,
      signal,
      timeout,
      onError,
    })

    return await response.text()
  }

  async post(
    url: string | URL,
    {
      headers,
      body,
      signal,
      timeout,
      onError,
    }: {
      readonly headers?: undefined | HTTPClientHeaders
      readonly body?: RequestInit['body']
      readonly signal?: undefined | AbortSignal
      readonly timeout?: undefined | number
      readonly onError?: undefined | HTTPClientOnErrorHandler
    },
  ): Promise<Response> {
    return await fetchResponse(this, url, {
      method: 'POST',
      headers,
      signal,
      timeout,
      onError,
      body,
    })
  }

  async postOkJSON<T = unknown>(
    url: string | URL,
    {
      guard,
      headers,
      body,
      coerce,
      signal,
      timeout,
      onError,
    }: {
      readonly guard?: undefined | Guard<T>
      readonly headers?: undefined | HTTPClientHeaders
      readonly body?: RequestInit['body']
      readonly coerce?: undefined | ((body: unknown) => unknown)
      readonly signal?: undefined | AbortSignal
      readonly timeout?: undefined | number
      readonly onError?: undefined | HTTPClientOnErrorHandler
    } = {},
  ): Promise<T> {
    const response = await fetchOkResponse(this, url, {
      method: 'POST',
      headers: mergeHeaders(
        { 'accept': 'application/json' },
        headers,
      ),
      signal,
      timeout,
      onError,
      body,
    })

    let responseBody = response.status === 204 ? undefined : await response.json()

    if (coerce !== undefined) {
      responseBody = coerce(responseBody)
    }

    if (guard !== undefined) {
      return assertReturn(guard, responseBody)
    }

    return responseBody
  }

  async put(
    url: string | URL,
    {
      headers,
      body,
      signal,
      timeout,
      onError,
    }: {
      readonly headers?: undefined | HTTPClientHeaders
      readonly body?: RequestInit['body']
      readonly signal?: undefined | AbortSignal
      readonly timeout?: undefined | number
      readonly onError?: undefined | HTTPClientOnErrorHandler
    },
  ): Promise<Response> {
    return await fetchResponse(this, url, {
      method: 'PUT',
      headers,
      signal,
      timeout,
      onError,
      body,
    })
  }

  async putOkJSON<T = unknown>(
    url: string | URL,
    {
      guard,
      headers,
      body,
      coerce,
      signal,
      timeout,
      onError,
    }: {
      readonly guard?: undefined | Guard<T>
      readonly headers?: undefined | HTTPClientHeaders
      readonly body?: RequestInit['body']
      readonly coerce?: undefined | ((body: unknown) => unknown)
      readonly signal?: undefined | AbortSignal
      readonly timeout?: undefined | number
      readonly onError?: undefined | HTTPClientOnErrorHandler
    } = {},
  ): Promise<T> {
    const response = await fetchOkResponse(this, url, {
      method: 'PUT',
      headers: mergeHeaders(
        { 'accept': 'application/json' },
        headers,
      ),
      signal,
      timeout,
      onError,
      body,
    })

    let responseBody = response.status === 204 ? undefined : await response.json()

    if (coerce !== undefined) {
      responseBody = coerce(responseBody)
    }

    if (guard !== undefined) {
      return assertReturn(guard, responseBody)
    }

    return responseBody
  }

  async delete(
    url: string | URL,
    {
      headers,
      signal,
      timeout,
      onError,
    }: {
      readonly headers?: undefined | HTTPClientHeaders
      readonly signal?: undefined | AbortSignal
      readonly timeout?: undefined | number
      readonly onError?: undefined | HTTPClientOnErrorHandler
    } = {},
  ): Promise<Response> {
    return await fetchResponse(this, url, {
      method: 'DELETE',
      headers,
      signal,
      timeout,
      onError,
    })
  }

  async deleteOkJSON<T = unknown>(
    url: string | URL,
    {
      guard,
      headers,
      coerce,
      signal,
      timeout,
      onError,
    }: {
      readonly guard?: undefined | Guard<T>
      readonly headers?: undefined | HTTPClientHeaders
      readonly coerce?: undefined | ((body: unknown) => unknown)
      readonly signal?: undefined | AbortSignal
      readonly timeout?: undefined | number
      readonly onError?: undefined | HTTPClientOnErrorHandler
    } = {},
  ): Promise<T> {
    const response = await fetchOkResponse(this, url, {
      method: 'DELETE',
      headers: mergeHeaders(
        { 'accept': 'application/json' },
        headers,
      ),
      signal,
      timeout,
      onError,
    })

    let responseBody = response.status === 204 ? undefined : await response.json()

    if (coerce !== undefined) {
      responseBody = coerce(responseBody)
    }

    if (guard !== undefined) {
      return assertReturn(guard, responseBody)
    }

    return responseBody
  }
}

function mergeHeaders(
  first: HeadersInit,
  ...rest: ReadonlyArray<HTTPClientHeaders | undefined>
): Headers {
  const resultHeaders = new Headers(first)

  for (const headers of rest) {
    if (headers !== undefined) {
      if (headers instanceof Headers) {
        for (const [key, value] of headers.entries()) {
          resultHeaders.set(key, value)
        }
      } else {
        for (const [key, value] of Object.entries(headers)) {
          if (typeof value === 'string') {
            resultHeaders.set(key, value)
          }
        }
      }
    }
  }

  return resultHeaders
}

async function fetchResponse(client: HTTPClient, url: string | URL, options: {
  readonly method: 'GET' | 'POST' | 'PUT' | 'DELETE'
  readonly headers?: undefined | HTTPClientHeaders
  readonly body?: RequestInit['body']
  readonly signal?: undefined | AbortSignal
  readonly timeout?: undefined | number
  readonly onError?: undefined | HTTPClientOnErrorHandler
}, retries = 0): Promise<Response> {
  using timeout = options.timeout === undefined ? undefined : Timeout.wait(options.timeout)

  const signal = mergeAbortSignals(
    options.signal,
    timeout?.signal,
  )
  const { onError, method, body, headers } = options

  try {
    if (signal !== undefined && signal.aborted === true) {
      throw new HTTPClientRequestAbortError(options.method, url.toString())
    }

    const readyHeaders = mergeHeaders(await client.loadHeaders(), headers)

    const response = await fetch(url, {
      method,
      body,
      headers: readyHeaders,
      signal,
    })

    return response
  } catch (error) {
    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        const abortError = new HTTPClientRequestAbortError(method, url.toString())

        const stack = error.stack?.split('\n').slice(1).join('\n')

        abortError.stack = abortError.message === ''
          ? `${abortError.name}\n${stack}`
          : `${abortError.name}: ${abortError.message}\n${stack}`

        // deno-lint-ignore no-ex-assign
        error = abortError
      }
    } else {
      // deno-lint-ignore no-ex-assign
      error = ensureError(error)
    }

    if (onError === undefined) {
      throw error
    }

    await onError(error as Error, retries)

    return await fetchResponse(client, url, { onError, method, body, headers, signal }, retries++)
  }
}

async function fetchOkResponse(client: HTTPClient, url: string | URL, options: {
  readonly method: 'GET' | 'POST' | 'PUT' | 'DELETE'
  readonly headers?: undefined | HTTPClientHeaders
  readonly body?: RequestInit['body']
  readonly signal?: undefined | AbortSignal
  readonly timeout?: undefined | number
  readonly onError?: undefined | HTTPClientOnErrorHandler
}, retries = 0): Promise<Response> {
  using timeout = options.timeout === undefined ? undefined : Timeout.wait(options.timeout)

  const signal = mergeAbortSignals(
    options.signal,
    timeout?.signal,
  )

  const { onError, method, body, headers } = options

  try {
    const response = await fetchResponse(client, url, { method, body, headers, signal })

    if (response.ok === false) {
      const body = response.headers
          .get('Content-Type')
          ?.toLocaleLowerCase()
          .includes('application/json')
        ? await response.json()
        : await response.text()

      if (response.status >= 500) {
        throw new HTTPServiceError(response.status, response.statusText, body)
      }

      throw new HTTPClientError(
        method,
        response.url,
        response.status,
        response.statusText,
        body,
        Object.fromEntries(response.headers),
      )
    }

    return response
  } catch (error) {
    if (onError === undefined) {
      throw error
    }

    await onError(ensureError(error), retries)

    return await fetchOkResponse(client, url, { onError, method, body, headers, signal }, retries++)
  }
}
