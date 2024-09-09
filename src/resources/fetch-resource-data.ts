import {
  array,
  assertReturn,
  type Guard,
  integer,
  literal,
  optional,
  props,
  string,
  unknown,
} from 'https://raw.githubusercontent.com/systematic-trader/type-guard/main/mod.ts'
import type { HTTPClient } from '../http-client.ts'

const EmptyResourceDataGuard = literal([])

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
  const resource = await client.getJSON(url)

  if (EmptyResourceDataGuard.accept(resource)) {
    return []
  }

  const { __next, Data } = assertReturn(ResourceDataGuard, resource)

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
