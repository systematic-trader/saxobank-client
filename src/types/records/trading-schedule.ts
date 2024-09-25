import {
  array,
  type GuardType,
  integer,
  props,
  string,
} from 'https://raw.githubusercontent.com/systematic-trader/type-guard/main/mod.ts'
import { InstrumentSession } from './instrument-session.ts'

export const TradingSchedule = props({
  Sessions: array(InstrumentSession),
  TimeZone: integer(),
  TimeZoneAbbreviation: string(),
  TimeZoneOffset: string(),
})

export interface TradingSchedule extends GuardType<typeof TradingSchedule> {}
