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
import type { HTTPClient } from '../http-client.ts'

const ResourceDataGuard = props({
  Data: array(unknown()),
  __count: optional(integer()),
  __next: optional(string()),
  MaxRows: optional(integer()),
})

export async function fetchResourceData<T = unknown>({
  client,
  url,
  guard,
}: {
  client: HTTPClient
  url: string | URL
  readonly guard?: undefined | Guard<T>
}): Promise<ReadonlyArray<T>> {
  const { __next, Data } = await client.getJSON(url, {
    guard: ResourceDataGuard,
  })

  const assertedData = guard === undefined ? (Data as ReadonlyArray<T>) : Data.map((datum) => {
    return assertReturn(guard, datum)
  })

  if (__next === undefined) {
    return assertedData
  }

  const nextData = await fetchResourceData<T>({
    client,
    url: __next,
    guard,
  })

  return assertedData.concat(nextData)
}
