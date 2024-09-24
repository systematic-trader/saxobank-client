import { assertReturn, type Guard } from 'https://raw.githubusercontent.com/systematic-trader/type-guard/main/mod.ts'
import { SaxoBank24HourToken } from './authentication/saxobank-24-hour-token.ts'
import type { SaxoBankAuthorization } from './authentication/saxobank-authentication.ts'

export class HTTPError extends Error {
  readonly statusCode: number
  readonly statusText: string

  constructor(message: string, statusCode: number, statusText: string) {
    super(message)
    this.statusCode = statusCode
    this.statusText = statusText

    this.name = 'HTTPError'
  }
}

export class HTTPClientError extends HTTPError {
  readonly body: unknown

  constructor(statusCode: number, statusText: string, href: string, body: unknown) {
    let message = `${statusCode} ${statusText} - ${href}`

    if (typeof body === 'string') {
      message = `${message}\n${body}`
    }

    if (typeof body === 'object' && body !== null) {
      message = `${message}\n${JSON.stringify(body, undefined, 2)}`
    }

    super(message, statusCode, statusText)
    this.body = body

    this.name = 'HTTPClientError'
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

    this.name = 'HTTPServiceError'
  }
}

export type HTTPClientHeaders = Headers | Record<string, undefined | string>

export class HTTPClient {
  static fromEnvironment(): HTTPClient {
    return this.withAuthorization(new SaxoBank24HourToken())
  }

  static withAuthorization(authentication: SaxoBankAuthorization): HTTPClient {
    return new HTTPClient({
      authentication,
    })
  }

  #constructorHeaders: Headers
  #authentication: undefined | SaxoBankAuthorization

  constructor({
    authentication,
    headers,
  }: {
    readonly authentication?: undefined | SaxoBankAuthorization
    readonly headers?: undefined | HTTPClientHeaders
  } = {}) {
    this.#authentication = authentication
    this.#constructorHeaders = mergeHeaders(new Headers(), headers)
  }

  get #authenticationHeaders(): Headers {
    if (this.#authentication === undefined) {
      return new Headers()
    }

    return new Headers({
      Authorization: `Bearer ${this.#authentication.accessToken}`,
    })
  }

  async get(
    url: string | URL,
    {
      headers: argumentHeaders,
    }: {
      readonly headers?: undefined | HTTPClientHeaders
    } = {},
  ): Promise<Response> {
    const headers = mergeHeaders(
      this.#constructorHeaders,
      this.#authenticationHeaders,
      argumentHeaders,
    )

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
    const response = await this.get(url, { headers })

    // console.log(response.headers)

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
    return await this.get(url, { headers }).then((response) => response.blob())
  }

  async getText(
    url: string | URL,
    {
      headers,
    }: {
      readonly headers?: undefined | HTTPClientHeaders
    } = {},
  ): Promise<string> {
    return await this.get(url, { headers }).then((response) => response.text())
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
    const headers = mergeHeaders(
      this.#constructorHeaders,
      this.#authenticationHeaders,
      argumentHeaders,
    )

    return await rateLimitFetch(this, url, {
      method: 'POST',
      headers,
      body,
    })
  }

  async postJSON<T = unknown>(
    url: string | URL,
    {
      guard,
      headers,
    }: {
      readonly guard?: undefined | Guard<T>
      readonly headers?: undefined | HTTPClientHeaders
    } = {},
  ): Promise<T> {
    const response = await this.post(url, { headers })

    const body = await response.json()

    if (guard !== undefined) {
      return assertReturn(guard, body)
    }

    return body
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
    const headers = mergeHeaders(
      this.#constructorHeaders,
      this.#authenticationHeaders,
      argumentHeaders,
    )

    return await rateLimitFetch(this, url, {
      method: 'PUT',
      headers,
      body,
    })
  }

  async putJSON<T = unknown>(
    url: string | URL,
    {
      guard,
      headers,
      body,
    }: {
      readonly guard?: undefined | Guard<T>
      readonly headers?: undefined | HTTPClientHeaders
      readonly body?: RequestInit['body']
    } = {},
  ): Promise<T> {
    const response = await this.put(url, {
      headers: {
        'content-type': 'application/json',
        ...headers,
      },
      body,
    })

    const responseBody = response.status === 204 ? undefined : await response.json()

    if (guard !== undefined) {
      return assertReturn(guard, responseBody)
    }

    return responseBody
  }

  async delete(
    url: string | URL,
    {
      headers: argumentHeaders,
    }: {
      readonly headers?: undefined | HTTPClientHeaders
    } = {},
  ): Promise<Response> {
    const headers = mergeHeaders(
      this.#constructorHeaders,
      this.#authenticationHeaders,
      argumentHeaders,
    )

    return await rateLimitFetch(this, url, { method: 'DELETE', headers })
  }
}

function mergeHeaders(
  first: Headers,
  ...rest: Array<Headers | HTTPClientHeaders | undefined>
): Headers {
  const headers = new Headers(first)

  for (const header of rest) {
    if (header !== undefined) {
      if (header instanceof Headers) {
        for (const [key, value] of header.entries()) {
          headers.set(key, value)
        }
      } else {
        for (const [key, value] of Object.entries(header)) {
          if (typeof value === 'string') {
            headers.set(key, value)
          }
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
  reference: HTTPClient,
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
      // console.log('response.status:', response.status)
      // console.log('response.headers:', response.headers)

      const rateLimit = getRateLimitExceeded(response.headers)

      if (rateLimit === undefined) {
        throw new HTTPClientError(
          response.status,
          response.statusText,
          response.url,
          await response.text(),
        )
      }

      // Prevent memory leak
      await response.body?.cancel()

      // console.log('rateLimit:', `${rateLimit.name} - ${rateLimit.sleep}`)

      let penaltyMap = RateLimitRefs.get(reference)

      if (penaltyMap === undefined) {
        penaltyMap = new Map()
        RateLimitRefs.set(reference, penaltyMap)
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
      // console.log('response.ok:', response.ok)
      // console.log('response.status:', response.status)
      // console.log(response.headers)

      const body = response.headers
          .get('Content-Type')
          ?.toLocaleLowerCase()
          .includes('application/json')
        ? await response.json()
        : await response.text()

      if (response.status >= 500) {
        throw new HTTPServiceError(response.status, response.statusText, body)
      }

      throw new HTTPClientError(response.status, response.statusText, response.url, body)
    }

    return response
  }
}

function getRateLimitExceeded(
  headers: Headers,
): undefined | { readonly name: string; readonly sleep: number } {
  const rateLimits: Array<{
    name: string
    sleep: undefined | number
    remaining: undefined | number
  }> = []

  for (const [key, value] of headers) {
    const regexRemaining = /x-ratelimit-(.*?)-remaining/i
    const matchRemaining = key.match(regexRemaining)

    if (matchRemaining !== null) {
      const name = matchRemaining[1]!.toLowerCase()
      const remaining = parseInt(value, 10)

      if (name === 'appday') {
        if (remaining === 0) {
          throw new Error('Rate limit exceeded for appday')
        } else {
          continue
        }
      }

      const entry = rateLimits.find((entry) => entry.name === name)

      if (entry === undefined) {
        rateLimits.push({ name, sleep: undefined, remaining })
      } else {
        entry.remaining = remaining
      }

      continue
    }

    const regexReset = /x-ratelimit-(.*?)-reset/i
    const matchReset = key.match(regexReset)

    if (matchReset !== null) {
      const name = matchReset[1]!.toLowerCase()

      if (name === 'appday') {
        continue
      }

      const sleep = parseInt(value, 10) * 1000

      const entry = rateLimits.find((entry) => entry.name === name)

      if (entry === undefined) {
        rateLimits.push({ name, sleep, remaining: undefined })
      } else {
        entry.sleep = sleep
      }
    }
  }

  if (rateLimits.length === 0) {
    return undefined
  }

  if (rateLimits.length > 1) {
    const names = rateLimits.map((entry) => entry.name).join(', ')

    throw new Error(`Multiple rate limits not supported: ${names}`)
  }

  const entry = rateLimits[0]!

  if (entry.remaining === 0) {
    return {
      name: entry.name,
      sleep: entry.sleep === undefined || entry.sleep === 0 ? 50 : entry.sleep,
    }
  }

  return undefined
}
