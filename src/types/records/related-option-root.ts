import {
  array,
  type GuardType,
  integer,
  props,
} from 'https://raw.githubusercontent.com/systematic-trader/type-guard/main/mod.ts'
import { AssetType } from '../derives/asset-type.ts'
import { OptionType } from '../derives/option-type.ts'
import { OptionsStrategyType } from '../derives/options-strategy-type.ts'

export interface RelatedOptionRoot extends GuardType<typeof RelatedOptionRoot> {}

export const RelatedOptionRoot = props({
  AssetType,
  OptionRootId: integer(),
  OptionType,
  SupportedStrategies: array(OptionsStrategyType),
})
