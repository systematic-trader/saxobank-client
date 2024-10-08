import { assertReturn, type Guard } from 'https://raw.githubusercontent.com/systematic-trader/type-guard/main/mod.ts'
import { SaxoBank24HourToken } from './authentication/saxobank-24-hour-token.ts'
import type { SaxoBankAuthorization } from './authentication/saxobank-authentication.ts'

export class HTTPError extends Error {
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
  readonly headers: Record<string, string>
  readonly body: unknown

  constructor(
    statusCode: HTTPClientError['statusCode'],
    statusText: HTTPClientError['statusText'],
    href: string,
    body: HTTPClientError['body'],
    headers: HTTPClientError['headers'],
  ) {
    let message = `${statusCode} ${statusText} - ${href}`

    if (typeof body === 'string') {
      message = `${message}\n${body}`
    }

    if (typeof body === 'object' && body !== null) {
      message = `${message}\n${JSON.stringify(body, undefined, 2)}`
    }

    super(message, statusCode, statusText)
    this.body = body
    this.headers = headers

    this.name = 'HTTPClientError'
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
      signal,
    }: {
      readonly headers?: undefined | HTTPClientHeaders
      readonly signal?: undefined | AbortSignal
    } = {},
  ): Promise<Response> {
    const headers = mergeHeaders(
      this.#constructorHeaders,
      this.#authenticationHeaders,
      argumentHeaders,
    )

    return await rateLimitFetch(this, url, { method: 'GET', headers, signal })
  }

  async getJSON<T = unknown>(
    url: string | URL,
    {
      guard,
      headers,
      coerce,
      signal,
    }: {
      readonly guard?: undefined | Guard<T>
      readonly headers?: undefined | HTTPClientHeaders
      readonly coerce?: undefined | ((body: unknown) => unknown)
      readonly signal?: undefined | AbortSignal
    } = {},
  ): Promise<T> {
    const response = await this.get(url, { headers, signal })

    // console.log(response.headers)

    let body = await response.json()

    if (coerce !== undefined) {
      body = coerce(body)
    }

    if (guard !== undefined) {
      return assertReturn(guard, body)
    }

    return body
  }

  async getBlob(
    url: string | URL,
    {
      headers,
      signal,
    }: {
      readonly headers?: undefined | HTTPClientHeaders
      readonly signal?: undefined | AbortSignal
    } = {},
  ): Promise<Blob> {
    return await this.get(url, { headers, signal }).then((response) => response.blob())
  }

  async getText(
    url: string | URL,
    {
      headers,
      signal,
    }: {
      readonly headers?: undefined | HTTPClientHeaders
      readonly signal?: undefined | AbortSignal
    } = {},
  ): Promise<string> {
    return await this.get(url, { headers, signal }).then((response) => response.text())
  }

  async post(
    url: string | URL,
    {
      headers: argumentHeaders,
      body,
      signal,
    }: {
      readonly headers?: undefined | HTTPClientHeaders
      readonly body?: RequestInit['body']
      readonly signal?: undefined | AbortSignal
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
      signal,
    })
  }

  async postJSON<T = unknown>(
    url: string | URL,
    {
      guard,
      headers,
      coerce,
      signal,
    }: {
      readonly guard?: undefined | Guard<T>
      readonly headers?: undefined | HTTPClientHeaders
      readonly coerce?: undefined | ((body: unknown) => unknown)
      readonly signal?: undefined | AbortSignal
    } = {},
  ): Promise<T> {
    const response = await this.post(url, { headers, signal })

    let body = await response.json()

    if (coerce !== undefined) {
      body = coerce(body)
    }

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
      signal,
    }: {
      readonly headers?: undefined | HTTPClientHeaders
      readonly body?: RequestInit['body']
      readonly signal?: undefined | AbortSignal
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
      signal,
    })
  }

  async putJSON<T = unknown>(
    url: string | URL,
    {
      guard,
      headers,
      body,
      coerce,
      signal,
    }: {
      readonly guard?: undefined | Guard<T>
      readonly headers?: undefined | HTTPClientHeaders
      readonly body?: RequestInit['body']
      readonly coerce?: undefined | ((body: unknown) => unknown)
      readonly signal?: undefined | AbortSignal
    } = {},
  ): Promise<T> {
    const response = await this.put(url, {
      headers: {
        'content-type': 'application/json',
        ...headers,
      },
      body,
      signal,
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
      headers: argumentHeaders,
      signal,
    }: {
      readonly headers?: undefined | HTTPClientHeaders
      readonly signal?: undefined | AbortSignal
    } = {},
  ): Promise<Response> {
    const headers = mergeHeaders(
      this.#constructorHeaders,
      this.#authenticationHeaders,
      argumentHeaders,
    )

    return await rateLimitFetch(this, url, { method: 'DELETE', headers, signal })
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
    readonly signal?: undefined | AbortSignal
  },
): Promise<Response> {
  while (true) {
    const response = await fetch(url, options)

    // console.log(response.headers)

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
          Object.fromEntries(response.headers),
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

      penaltyPromise = new Promise((resolve) => {
        const timer = setTimeout(() => {
          penaltyMap!.delete(rateLimit.name)
          resolve()
        }, rateLimit.sleep)

        Deno.unrefTimer(timer)
      })

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

      throw new HTTPClientError(
        response.status,
        response.statusText,
        response.url,
        body,
        Object.fromEntries(response.headers),
      )
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
      // Always sleep at least 1000 milliseconds
      sleep: entry.sleep === undefined || entry.sleep < 1000 ? 1000 : entry.sleep,
    }
  }

  return undefined
}

// ----------------------------------------------------------------------------
// ----------------------------------------------------------------------------

// const RateLimitRefs2 = new WeakMap<
//   HTTPClient,
//   Map<string, undefined | number>
// >()

// async function rateLimitFetch2(
//   reference: HTTPClient,
//   url: string | URL,
//   options: {
//     readonly method: 'GET' | 'POST' | 'PUT' | 'DELETE'
//     readonly headers?: undefined | Headers
//     readonly body?: RequestInit['body']
//     readonly signal?: undefined | AbortSignal
//   },
// ): Promise<Response> {
//   const response = await fetch(url, options)

//   // console.log(response.headers)

//   if (response.status === 429) {
//     // console.log('response.status:', response.status)
//     // console.log('response.headers:', response.headers)

//     const rateLimit = getRateLimitExceeded(response.headers)

//     if (rateLimit === undefined) {
//       throw new HTTPClientError(
//         response.status,
//         response.statusText,
//         response.url,
//         await response.text(),
//         Object.fromEntries(response.headers),
//       )
//     }

//     // Prevent memory leak
//     await response.body?.cancel()

//     // console.log('rateLimit:', `${rateLimit.name} - ${rateLimit.sleep}`)

//     let sleepMap = RateLimitRefs2.get(reference)

//     if (sleepMap === undefined) {
//       sleepMap = new Map()
//       RateLimitRefs2.set(reference, sleepMap)
//     }

//     let wakeUp = sleepMap.get(rateLimit.name)

//     if (wakeUp === undefined) {
//       wakeUp = Date.now() + rateLimit.sleep
//       sleepMap.set(rateLimit.name, wakeUp)
//     }

//     const sleep = wakeUp - Date.now()

//     await new Promise<void>((resolve) => {
//       const timer = setTimeout(() => {
//         sleepMap!.delete(rateLimit.name)
//         resolve()
//       }, sleep)

//       Deno.unrefTimer(timer)
//     })

//     return rateLimitFetch2(reference, url, options)
//   } else if (response.ok === false) {
//     // console.log('response.ok:', response.ok)
//     // console.log('response.status:', response.status)
//     // console.log(response.headers)

//     const body = response.headers
//         .get('Content-Type')
//         ?.toLocaleLowerCase()
//         .includes('application/json')
//       ? await response.json()
//       : await response.text()

//     if (response.status >= 500) {
//       throw new HTTPServiceError(response.status, response.statusText, body)
//     }

//     throw new HTTPClientError(
//       response.status,
//       response.statusText,
//       response.url,
//       body,
//       Object.fromEntries(response.headers),
//     )
//   }

//   return response
// }
