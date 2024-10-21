import { enums, type GuardType } from 'https://raw.githubusercontent.com/systematic-trader/type-guard/main/mod.ts'

export type ClientType = GuardType<typeof ClientType>

// This is an undocumented enum-type - we don't know the possible values.
export const ClientType = enums([
  'Normal',
])
