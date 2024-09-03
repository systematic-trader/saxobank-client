import { assertReturn, type Guard } from 'https://raw.githubusercontent.com/systematic-trader/type-guard/main/mod.ts'

export class HTTPError extends Error {
  readonly statusCode: number
  readonly statusText: string

  constructor(message: string, statusCode: number, statusText: string) {
    super(message)
    this.statusCode = statusCode
    this.statusText = statusText
  }
}

export class HTTPClientError extends HTTPError {
  readonly body: unknown

  constructor(statusCode: number, statusText: string, body: unknown) {
    let message = `${statusCode} ${statusText}`

    if (typeof body === 'string') {
      message = `${message}\n${body}`
    }

    if (typeof body === 'object' && body !== null) {
      message = `${message}\n${JSON.stringify(body, undefined, 2)}`
    }

    super(message, statusCode, statusText)
    this.body = body
  }
}

export class HTTPServiceError extends HTTPError {
  readonly body: unknown

  constructor(statusCode: number, statusText: string, body: unknown) {
    let message = `${statusCode} ${statusText}`

    if (typeof body === 'string') {
      message = `${message}\n${body}`
    }

    if (typeof body === 'object' && body !== null) {
      message = `${message}\n${JSON.stringify(body, undefined, 2)}`
    }

    super(message, statusCode, statusText)
    this.body = body
  }
}

export type HTTPClientHeaders = Headers | Record<string, undefined | string>

export class HTTPClient {
  static withBearerToken(token: string): HTTPClient {
    return new HTTPClient({
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
  }

  #headers: Headers

  constructor({
    headers,
  }: { readonly headers?: undefined | HTTPClientHeaders } = {}) {
    this.#headers = mergeHeaders(new Headers(), headers)
  }

  async #get(
    url: string | URL,
    {
      headers: argumentHeaders,
    }: {
      readonly headers?: undefined | HTTPClientHeaders
    } = {},
  ): Promise<Response> {
    const headers = mergeHeaders(this.#headers, argumentHeaders)

    return await rateLimitFetch(this, url, { method: 'GET', headers })
  }

  async getJSON<T = unknown>(
    url: string | URL,
    {
      guard,
      headers,
    }: {
      readonly guard?: undefined | Guard<T>
      readonly headers?: undefined | HTTPClientHeaders
    } = {},
  ): Promise<T> {
    const response = await this.#get(url, { headers })

    const body = await response.json()

    if (guard !== undefined) {
      return assertReturn(guard, body)
    }

    return body
  }

  async getBlob(
    url: string | URL,
    {
      headers,
    }: {
      readonly headers?: undefined | HTTPClientHeaders
    } = {},
  ): Promise<Blob> {
    return await this.#get(url, { headers }).then((response) => response.blob())
  }

  async getText(
    url: string | URL,
    {
      headers,
    }: {
      readonly headers?: undefined | HTTPClientHeaders
    } = {},
  ): Promise<string> {
    return await this.#get(url, { headers }).then((response) => response.text())
  }

  async post(
    url: string | URL,
    {
      headers: argumentHeaders,
      body,
    }: {
      readonly headers?: undefined | HTTPClientHeaders
      readonly body?: RequestInit['body']
    },
  ): Promise<Response> {
    const headers = mergeHeaders(this.#headers, argumentHeaders)

    return await rateLimitFetch(this, url, {
      method: 'POST',
      headers,
      body,
    })
  }

  async put(
    url: string | URL,
    {
      headers: argumentHeaders,
      body,
    }: {
      readonly headers?: undefined | HTTPClientHeaders
      readonly body?: RequestInit['body']
    },
  ): Promise<Response> {
    const headers = mergeHeaders(this.#headers, argumentHeaders)

    return await rateLimitFetch(this, url, {
      method: 'PUT',
      headers,
      body,
    })
  }

  async delete(
    url: string | URL,
    {
      headers: argumentHeaders,
    }: {
      readonly headers?: undefined | HTTPClientHeaders
    } = {},
  ): Promise<Response> {
    const headers = mergeHeaders(this.#headers, argumentHeaders)

    return await rateLimitFetch(this, url, { method: 'DELETE', headers })
  }
}

function mergeHeaders(
  first: Headers,
  second: undefined | HTTPClientHeaders,
): Headers {
  const headers = new Headers(first)

  if (second !== undefined) {
    if (second instanceof Headers) {
      for (const [key, value] of second.entries()) {
        headers.set(key, value)
      }
    } else {
      for (const [key, value] of Object.entries(second)) {
        if (typeof value === 'string') {
          headers.set(key, value)
        }
      }
    }
  }

  return headers
}

const RateLimitRefs = new WeakMap<
  HTTPClient,
  Map<string, undefined | Promise<void>>
>()

async function rateLimitFetch(
  ref: HTTPClient,
  url: string | URL,
  options: {
    readonly method: 'GET' | 'POST' | 'PUT' | 'DELETE'
    readonly headers?: undefined | Headers
    readonly body?: RequestInit['body']
  },
): Promise<Response> {
  while (true) {
    const response = await fetch(url, options)

    if (response.status === 429) {
      const rateLimit = getRateLimit(response.headers)

      if (rateLimit === undefined) {
        throw new HTTPClientError(
          response.status,
          response.statusText,
          await response.text(),
        )
      }

      let penaltyMap = RateLimitRefs.get(ref)

      if (penaltyMap === undefined) {
        penaltyMap = new Map()
        RateLimitRefs.set(ref, penaltyMap)
      }

      let penaltyPromise = penaltyMap.get(rateLimit.name)

      if (penaltyPromise !== undefined) {
        await penaltyPromise

        continue
      }

      penaltyPromise = new Promise((resolve) =>
        setTimeout(() => {
          penaltyMap!.delete(rateLimit.name)
          resolve()
        }, rateLimit.sleep)
      )

      penaltyMap.set(rateLimit.name, penaltyPromise)

      await penaltyPromise

      continue
    }

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

      throw new HTTPClientError(response.status, response.statusText, body)
    }

    return response
  }
}

function getRateLimit(
  headers: Headers,
): undefined | { name: string; sleep: number } {
  for (const [key, value] of headers.entries()) {
    const regex = /x-ratelimit-(.*?)-reset/
    const match = key.match(regex)

    if (match !== null) {
      const name = match[1]!
      const sleep = parseInt(value, 10) * 1000

      return { name, sleep }
    }
  }

  return undefined
}
