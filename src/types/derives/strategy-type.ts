import {
  enums,
  type GuardType,
} from 'https://raw.githubusercontent.com/systematic-trader/type-guard/main/mod.ts'

export type StrategyType = GuardType<typeof StrategyType>

export const StrategyType = enums([
  /** A calendar spread strategy. */
  'CalendarSpread',
])
