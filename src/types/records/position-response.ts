import {
  type GuardType,
  optional,
  props,
  string,
} from 'https://raw.githubusercontent.com/systematic-trader/type-guard/main/mod.ts'
import { InstrumentDisplayAndFormat } from '../derives/instrument-display-and-format.ts'
import { InstrumentExchangeDetails } from '../derives/instrument-exchange-details.ts'
import { Greeks } from '../derives/greeks.ts'
import { PositionCost } from '../derives/position-cost.ts'
import { PositionStatic } from '../derives/position-static.ts'
import { PositionDynamic } from '../derives/position-dynamic.ts'

export interface PositionResponse extends GuardType<typeof PositionResponse> {}

export const PositionResponse = props({
  /** Trading costs associated with opening/closing a position. */
  Costs: PositionCost,

  /** Information about the position instrument and how to display it. */
  DisplayAndFormat: InstrumentDisplayAndFormat,

  /** Information about the instrument's exchange and trading status. */
  Exchange: InstrumentExchangeDetails,

  /** Greeks, only available for options, i.e. FX Options, Contract Options, and Contract Options CFDs. */
  Greeks: optional(Greeks),

  /** The id of the NetPosition, to which this position is belongs. All positions in the same instrument have the same NetPositionId. */
  NetPositionId: string(),

  /** Static part of position information. */
  PositionBase: PositionStatic,

  /** Unique id of this position. */
  PositionId: string(),

  /** Dynamic part of position information. */
  PositionView: PositionDynamic,

  /** Information about the underlying instrument of the net position and how to display it. */
  UnderlyingDisplayAndFormat: optional(InstrumentDisplayAndFormat),
})
