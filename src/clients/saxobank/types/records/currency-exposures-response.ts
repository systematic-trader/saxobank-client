import {
  type GuardType,
  number,
  optional,
  props,
} from 'https://raw.githubusercontent.com/systematic-trader/type-guard/main/mod.ts'
import { Currency3 } from '../derives/currency.ts'

export interface CurrencyExposuresResponse extends GuardType<typeof CurrencyExposuresResponse> {}

export const CurrencyExposuresResponse = props({
  /** Total exposure in the given currency. */
  Amount: number(),

  /** Total exposure in the currency of the calculation entity. */
  AmountInCalculationEntityCurrency: optional(number()),

  /** The exposure currency. */
  Currency: Currency3,
})
