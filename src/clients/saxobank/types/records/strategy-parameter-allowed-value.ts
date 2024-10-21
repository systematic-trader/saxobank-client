import {
  type GuardType,
  props,
  string,
} from 'https://raw.githubusercontent.com/systematic-trader/type-guard/main/mod.ts'

export interface StrategyParameterAllowedValue extends GuardType<typeof StrategyParameterAllowedValue> {}

export const StrategyParameterAllowedValue = props({
  Name: string(),
  Value: string(),
})
