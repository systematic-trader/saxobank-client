import {
  type GuardType,
  integer,
  props,
} from 'https://raw.githubusercontent.com/systematic-trader/type-guard/main/mod.ts'
import { AssetType } from '../derives/asset-type.ts'

export interface InstrumentKey extends GuardType<typeof InstrumentKey> {}

export const InstrumentKey = props({
  AssetType,
  Uic: integer(),
})
