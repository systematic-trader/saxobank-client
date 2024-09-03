import { enums, type GuardType } from 'https://raw.githubusercontent.com/systematic-trader/type-guard/main/mod.ts'

export type SupportedStrategyType = GuardType<typeof SupportedStrategyType>

export const SupportedStrategyType = enums([
  'Dark',
  'Iceberg',
  'Implementation Shortfall',
  'Limit on Close (LOC)',
  'Liquidity Seeking',
  'Market on Close (MOC)',
  'Nordic@Mid',
  'Pre-Market Limit',
  'Price Peg',
  'Target Close',
  'TWAP',
  'VWAP',
  'With Volume',
])
