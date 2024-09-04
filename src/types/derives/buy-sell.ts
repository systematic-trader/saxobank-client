import { enums, type GuardType } from 'https://raw.githubusercontent.com/systematic-trader/type-guard/main/mod.ts'

export type BuySell = GuardType<typeof BuySell>

export const BuySell = enums(['Buy', 'Sell'])
