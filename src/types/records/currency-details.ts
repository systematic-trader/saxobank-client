import {
  type GuardType,
  integer,
  optional,
  props,
  string,
} from 'https://raw.githubusercontent.com/systematic-trader/type-guard/main/mod.ts'
import { Currency3 } from '../derives/currency.ts'

export const CurrencyDetails = props({
  CurrencyCode: Currency3,
  Decimals: integer({ minimum: 0, maximum: 3 }),
  Name: string(),
  Symbol: optional(string()),
})

export interface CurrencyDetails extends GuardType<typeof CurrencyDetails> {}
