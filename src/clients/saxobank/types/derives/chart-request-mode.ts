import { enums, type GuardType } from 'https://raw.githubusercontent.com/systematic-trader/type-guard/main/mod.ts'

export type ChartRequestMode = GuardType<typeof ChartRequestMode>

export const ChartRequestMode = enums([
  /** From */
  'From',

  /** Up to */
  'UpTo',
])
