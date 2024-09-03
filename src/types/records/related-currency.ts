import {
  type GuardType,
  integer,
  props,
} from 'https://raw.githubusercontent.com/systematic-trader/type-guard/main/mod.ts'
import { Currency3 } from '../derives/currency.ts'

export interface RelatedCurrency extends GuardType<typeof RelatedCurrency> {}

export const RelatedCurrency = props({
  CurrencyCode: Currency3,
  Uic: integer(),
})
