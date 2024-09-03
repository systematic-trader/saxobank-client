import {
  format,
  type GuardType,
  props,
} from 'https://raw.githubusercontent.com/systematic-trader/type-guard/main/mod.ts'
import { InstrumentSessionState } from '../derives/instrument-session-state.ts'

export interface InstrumentSession extends GuardType<typeof InstrumentSession> {}

export const InstrumentSession = props({
  EndTime: format('date-iso8601'),
  StartTime: format('date-iso8601'),
  State: InstrumentSessionState,
})
