import {
  type GuardType,
  integer,
  optional,
  props,
} from 'https://raw.githubusercontent.com/systematic-trader/type-guard/main/mod.ts'
import { Currency3 } from '../derives/currency.ts'

export type OrderSetting = GuardType<typeof OrderSetting>

export const OrderSetting = props({
  Currency: optional(Currency3),
  MaxOrderSize: optional(integer()),
  MaxOrderValue: optional(integer()),
  MinOrderValue: optional(integer()),
})
