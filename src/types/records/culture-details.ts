import {
  type GuardType,
  props,
  string,
} from 'https://raw.githubusercontent.com/systematic-trader/type-guard/main/mod.ts'

export interface CultureDetails extends GuardType<typeof CultureDetails> {}

export const CultureDetails = props({
  CultureCode: string(),
  Name: string(),
})
