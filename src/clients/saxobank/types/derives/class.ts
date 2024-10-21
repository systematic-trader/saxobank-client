import { enums, type GuardType } from 'https://raw.githubusercontent.com/systematic-trader/type-guard/main/mod.ts'

export type ClassType = GuardType<typeof Class>

export const Class = enums([
  'Complex',
  'NonComplex',
])
