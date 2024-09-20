import {
  array,
  assertReturn,
  type Guard,
  integer,
  optional,
  props,
  string,
  unknown,
} from 'https://raw.githubusercontent.com/systematic-trader/type-guard/main/mod.ts'
import { Environment } from './environment.ts'
import type { HTTPClient } from './http-client.ts'

export class ResourceClient {
  readonly #client: HTTPClient
  readonly #headers: Record<string, string>
  readonly #prefixURL: string

  constructor({
    client,
    headers = {},
    prefixURL = Environment['SAXOBANK_API_PREFIX_URL'] ?? 'https://gateway.saxobank.com/sim/openapi',
  }: {
    readonly client: HTTPClient
    readonly prefixURL?: undefined | string
    readonly headers?: undefined | Record<string, string>
  }) {
    this.#client = client
    this.#headers = headers
    this.#prefixURL = prefixURL
  }

  appendPath(path: string): ResourceClient {
    return new ResourceClient({
      client: this.#client,
      headers: this.#headers,
      prefixURL: urlJoin(this.#prefixURL, path).href,
    })
  }

  async get<T = unknown>(options: {
    readonly path?: undefined | string
    readonly headers?: undefined | Record<string, string>
    readonly searchParams?:
      | undefined
      | Record<
        string,
        undefined | boolean | number | string | readonly string[]
      >
    readonly guard?: undefined | Guard<T>
  } = {}): Promise<T> {
    const url = urlJoin(this.#prefixURL, options.path)
    const headers = { ...this.#headers, ...options.headers }

    setSearchParams(url, options.searchParams)

    return await this.#client.getJSON(url, { headers, guard: options.guard })
  }

  async getPaginated<T = unknown>(options: {
    readonly limit?: undefined | number
    readonly path?: undefined | string
    readonly headers?: undefined | Record<string, string>
    readonly searchParams?:
      | undefined
      | Record<
        string,
        undefined | boolean | number | string | readonly string[]
      >
    readonly guard?: undefined | Guard<T>
  } = {}): Promise<ReadonlyArray<T>> {
    if (typeof options.limit === 'number') {
      if (options.limit === 0) {
        return []
      }

      if (Number.isSafeInteger(options.limit) === false || options.limit < 0) {
        throw new Error('Limit must be a non-negative integer')
      }
    }

    const url = urlJoin(this.#prefixURL, options.path)
    const headers = { ...this.#headers, ...options.headers }
    const searchParams = {
      $top: '1000',
      $skip: '0',
      ...options.searchParams,
    }

    setSearchParams(url, searchParams)

    return await fetchResourceData({
      client: this.#client,
      headers,
      url,
      guard: options.guard,
      limit: options.limit,
    })
  }
}

function urlJoin(base: string | URL, ...paths: ReadonlyArray<undefined | string>): URL {
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

function setSearchParams(
  url: URL,
  searchParams:
    | undefined
    | Record<string, undefined | boolean | number | string | readonly string[]>,
): void {
  if (searchParams === undefined) {
    return
  }

  for (const [key, value] of Object.entries(searchParams)) {
    if (value === undefined) {
      continue
    }

    const stringifiedValue = String(value)

    if (stringifiedValue === '') {
      continue
    }

    url.searchParams.set(key, String(value))
  }
}

const EmptyResourceDataGuard = array(unknown(), { length: 0 })

const ResourceDataGuard = props({
  Data: array(unknown()),
  __count: optional(integer()),
  __next: optional(string()),
  MaxRows: optional(integer()),
})

async function fetchResourceData<T = unknown>({
  client,
  headers,
  url,
  guard,
  limit,
}: {
  readonly client: HTTPClient
  readonly headers: Record<string, string>
  readonly url: string | URL
  readonly guard?: undefined | Guard<T>
  readonly limit?: undefined | number
}): Promise<ReadonlyArray<T>> {
  if (limit !== undefined && limit <= 0) {
    return []
  }

  const resource = await client.getJSON(url, { headers })

  if (EmptyResourceDataGuard.accept(resource)) {
    return []
  }

  const { __next, Data } = assertReturn(ResourceDataGuard, resource)

  const assertedData = guard === undefined ? (Data as ReadonlyArray<T>) : Data.map((datum) => {
    return assertReturn(guard, datum)
  })

  if (__next === undefined) {
    if (limit !== undefined && assertedData.length > limit) {
      return assertedData.slice(0, limit)
    }

    return assertedData
  }

  if (limit !== undefined) {
    if (assertedData.length === limit) {
      return assertedData
    } else if (assertedData.length > limit) {
      return assertedData.slice(0, limit)
    }

    limit -= assertedData.length
  }

  const nextData = await fetchResourceData<T>({
    client,
    headers,
    url: __next,
    guard,
    limit,
  })

  return assertedData.concat(nextData)
}
