import safeStringify from 'npm:fast-safe-stringify@2.1.1'
import sjson from 'npm:secure-json-parse@3.0.0'

export type JSONType =
  | JSONPrimitive
  | JSONArray
  | JSONReadonlyArray
  | JSONRecord
  | JSONReadonlyRecord

export type JSONPrimitive = null | undefined | boolean | number | string
export interface JSONArray extends Array<JSONType> {}
export interface JSONReadonlyArray extends ReadonlyArray<JSONType> {}
export type JSONRecord = { [key: string]: JSONType }
export type JSONReadonlyRecord = { readonly [key: string]: JSONType }

const ParseOptions = {
  protoAction: 'remove',
  constructorAction: 'remove',
} as const

export interface ParseJSONReviver {
  // deno-lint-ignore no-explicit-any
  (this: any, key: string, value: JSONType): JSONType
}

export function parseJSON(json: string, reviver?: undefined | ParseJSONReviver): JSONType {
  if (reviver === undefined) {
    return sjson.parse(json, ParseOptions)
  } else {
    return sjson.parse(json, reviver, ParseOptions)
  }
}

export function stringifyJSON(
  value: unknown,
  replacer?: undefined | ((key: string, value: unknown) => unknown),
  space?: undefined | number | string,
  options?: undefined | { readonly depthLimit: undefined | number; readonly edgesLimit: undefined | number },
): string {
  return safeStringify.default(value, replacer, space, options)
}
