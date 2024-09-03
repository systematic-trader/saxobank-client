import {
  type GuardType,
  integer,
  optional,
  props,
  string,
} from 'https://raw.githubusercontent.com/systematic-trader/type-guard/main/mod.ts'
import { CountryCodeA2, CountryCodeA3 } from '../derives/country.ts'

export const CountryDetails = props({
  A3: optional(CountryCodeA3), // 3-letter ISO-3166 country code.
  CountryCode: CountryCodeA2, // 2-letter ISO-3166 country code. (Also called A2 in ISO 3166 standard).
  DisplayName: string(), // Name of the country in the language selected by the user.
  Name: string(), // Name of the country in English.
  Numeric: optional(integer()), // Numeric country code.
})

export interface CountryDetails extends GuardType<typeof CountryDetails> {}
