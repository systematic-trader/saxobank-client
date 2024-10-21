import { enums, type GuardType } from 'https://raw.githubusercontent.com/systematic-trader/type-guard/main/mod.ts'

export type TradingConditionFieldGroup = GuardType<typeof TradingConditionFieldGroup>

export const TradingConditionFieldGroup = enums([
  /** Display and Format. */
  'DisplayAndFormat',
])
