import { enums, type GuardType } from 'https://raw.githubusercontent.com/systematic-trader/type-guard/main/mod.ts'

export type MarginOverviewGroupType = GuardType<typeof MarginOverviewGroupType>

export const MarginOverviewGroupType = enums([
  /** Margin impact of CFDs - presumably all categories */
  'CFDs',

  /** Margin impact of future and option contract instruments */
  'FuturesAndOptions',

  /** Margin impact of FX instruments */
  'FX',

  /** Margin overview group based on unspecified criteria */
  'Other',
])
