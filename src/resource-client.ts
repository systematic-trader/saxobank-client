import {
  array,
  assertReturn,
  integer,
  optional,
  props,
  string,
  unknown,
  type Guard,
} from 'https://raw.githubusercontent.com/systematic-trader/type-guard/main/mod.ts'
import type { HTTPClient } from './http-client.ts'

export class ResourceClient {
  readonly #client: HTTPClient
  readonly #headers: Record<string, string>
  readonly #prefixURL: string

  constructor({
    client,
    headers = {},
    prefixURL,
  }: {
    readonly client: HTTPClient
    readonly prefixURL: string
    readonly headers?: undefined | Record<string, string>
  }) {
    this.#client = client
    this.#headers = headers
    this.#prefixURL = prefixURL
  }

  async getOne<T = unknown>(options: {
    readonly path: string
    readonly headers?: undefined | Record<string, string>
    readonly searchParams?:
      | undefined
      | Record<string, undefined | number | string>
    readonly guard?: undefined | Guard<T>
  }): Promise<T> {
    const url = urlJoin(this.#prefixURL, options.path)
    const headers = { ...this.#headers, ...options.headers }

    setSearchParams(url, options.searchParams)

    return await this.#client.getJSON(url, { headers, guard: options.guard })
  }

  async getMany<T>(options: {
    readonly path: string
    readonly headers?: undefined | Record<string, string>
    readonly searchParams?: undefined | Record<string, number | string>
    readonly guard?: undefined | Guard<T>
  }): Promise<ReadonlyArray<T>> {
    const url = urlJoin(this.#prefixURL, options.path)
    const headers = { ...this.#headers, ...options.headers }
    const searchParams = { $top: '1000', $skip: '0', ...options.searchParams }

    setSearchParams(url, searchParams)

    return await fetchResourceData({
      client: this.#client,
      headers,
      url,
      guard: options.guard,
    })
  }
}

function urlJoin(base: string | URL, ...paths: readonly string[]): URL {
  let url = new URL(base)

  for (const path of paths) {
    const nextBase = url.href.endsWith('/') ? url.href : `${url.href}/`
    const nextPath = path.startsWith('/') ? path.slice(1) : path

    url = new URL(nextPath, nextBase)
  }

  return url
}

function setSearchParams(
  url: URL,
  searchParams: undefined | Record<string, undefined | number | string>
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
}: {
  readonly client: HTTPClient
  readonly headers: Record<string, string>
  readonly url: string | URL
  readonly guard?: undefined | Guard<T>
}): Promise<ReadonlyArray<T>> {
  const resource = await client.getJSON(url, { headers })

  if (EmptyResourceDataGuard.accept(resource)) {
    return []
  }

  const { __next, Data } = assertReturn(ResourceDataGuard, resource)

  const assertedData =
    guard === undefined
      ? (Data as ReadonlyArray<T>)
      : Data.map((datum) => {
          return assertReturn(guard, datum)
        })

  if (__next === undefined) {
    return assertedData
  }

  const nextData = await fetchResourceData<T>({
    client,
    headers,
    url: __next,
    guard,
  })

  return assertedData.concat(nextData)
}
