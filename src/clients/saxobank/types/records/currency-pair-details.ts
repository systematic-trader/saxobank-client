import {
  array,
  type GuardType,
  props,
} from 'https://raw.githubusercontent.com/systematic-trader/type-guard/main/mod.ts'
import { Currency3 } from '../derives/currency.ts'
import { RelatedCurrency } from './related-currency.ts'

export interface CurrencyPairDetails extends GuardType<typeof CurrencyPairDetails> {}

export const CurrencyPairDetails = props({
  CurrencyCode: Currency3,
  RelatedCurrencies: array(RelatedCurrency),
})
