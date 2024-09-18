import {
  enums,
  type GuardType,
} from 'https://raw.githubusercontent.com/systematic-trader/type-guard/main/mod.ts'

export type SupportedStrategyType = GuardType<typeof SupportedStrategyType>

export const SupportedStrategyType = enums([
  'Dark',
  'Iceberg',
  'Iceberg (Futures)',
  'Implementation Shortfall',
  'Limit on Close (LOC)',
  'Liquidity Seeking',
  'Market on Close (MOC)',
  'Nordic@Mid',
  'Pre-Market Limit',
  'Price Peg',
  'Price Peg (Futures)',
  'Target Close',
  'Target Close (Futures)',
  'TWAP',
  'TWAP (Futures)',
  'VWAP',
  'VWAP (Futures)',
  'With Volume',
  'With Volume (Futures)',
])
