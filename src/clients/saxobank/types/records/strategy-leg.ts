import {
  enums,
  type GuardType,
  integer,
  number,
  optional,
  props,
  string,
} from 'https://raw.githubusercontent.com/systematic-trader/type-guard/main/mod.ts'
import { AssetType } from '../derives/asset-type.ts'

export interface StrategyLeg extends GuardType<typeof StrategyLeg> {}

export const StrategyLeg = props({
  AssetType,
  BuySell: enums(['Buy', 'Sell']),
  Description: optional(string()),
  LegNumber: integer(),
  Multiplier: number(),
  Uic: integer(),
})
