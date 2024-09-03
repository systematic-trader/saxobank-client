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
import type { HTTPClient } from '../../http-client.ts'

const PaginationGuard = props({
  Data: array(unknown()),
  __count: optional(integer()),
  __next: optional(string()),
  MaxRows: optional(integer()),
})

export async function fetchPaginated<T>(
  { client, url, guard }: {
    readonly client: HTTPClient
    readonly url: string | URL
    readonly guard: Guard<T>
  },
): Promise<ReadonlyArray<T>> {
  const page = await client.getJSON(url, {
    guard: PaginationGuard,
  })

  const assertedData = page['Data'].map((entry) => {
    try {
      return assertReturn(guard, entry)
    } catch (error) {
      // deno-lint-ignore no-console
      console.error(entry)
      throw error
    }
  })

  if (page['__next'] === undefined) {
    return assertedData
  }

  const nextData = await fetchPaginated<T>({
    client,
    url: page['__next'],
    guard,
  })

  return assertedData.concat(nextData)
}
