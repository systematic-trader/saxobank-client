import { enums, type GuardType } from 'https://raw.githubusercontent.com/systematic-trader/type-guard/main/mod.ts'

export type OptionType = GuardType<typeof OptionType>

export const OptionType = enums([
  'Adjusted',
  'AdjustedWithDifferentMarket',
  'Default',
  'DefaultWithDifferentMarket',
])
