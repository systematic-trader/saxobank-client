import { enums, type GuardType } from 'https://raw.githubusercontent.com/systematic-trader/type-guard/main/mod.ts'

export type PriceSourceType = GuardType<typeof PriceSourceType>

/** Not documented */
export const PriceSourceType = enums(['Indicative', 'Firm'])
