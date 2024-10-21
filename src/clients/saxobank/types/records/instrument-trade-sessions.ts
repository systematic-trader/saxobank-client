import {
  array,
  integer,
  optional,
  props,
  string,
} from 'https://raw.githubusercontent.com/systematic-trader/type-guard/main/mod.ts'
import { InstrumentSession } from './instrument-session.ts'

export const InstrumentTradeSessions = props({
  Sessions: array(InstrumentSession),
  TimeZone: integer(),
  TimeZoneAbbreviation: optional(string()),
  TimeZoneOffset: string(),
})
