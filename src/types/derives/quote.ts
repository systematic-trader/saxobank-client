import {
  type GuardType,
  integer,
  literal,
  number,
  optional,
  props,
  string,
  union,
} from 'https://raw.githubusercontent.com/systematic-trader/type-guard/main/mod.ts'
import { ErrorCode } from './error-code.ts'
import { MarketState } from './market-state.ts'
import { PriceQuality } from './price-quality.ts'
import { PriceSourceType } from './price-source-type.ts'

const Base = props({
  /** The amount for which the quote is calculated. */
  Amount: integer(),

  /** If set, it defines the number of minutes by which the price is delayed. */
  DelayedByMinutes: integer(),

  /** Gets or sets the error code. */
  ErrorCode: ErrorCode,

  /** Not documented */
  MarketState: MarketState,

  /** The source for the price information */
  PriceSource: string(),

  /**
   * Suggested price based on best available price information.
   * Typically used as suggested price when exchange is closed.
   */
  ReferencePrice: optional(number()),

  /** Not documented */
  PriceSourceType: PriceSourceType,
})

/**
 * Additional information related to the instrument
 *
 * Price values are depending on a subscription to a feed.
 * This can mean no data, delayed data or real time data dependent on the callers subscription setup.
 */
export const Quote = union([
  // Both ask and bid are given
  Base.merge(props({
    PriceTypeAsk: PriceQuality.extract(['Tradable', 'Indicative', 'OldIndicative']),
    Ask: number(),
    AskSize: number(),

    PriceTypeBid: PriceQuality.extract(['Tradable', 'Indicative', 'OldIndicative']),
    Bid: number(),
    BidSize: number(),

    Mid: number(),
  })),

  // Neither ask nor bid are given
  Base.merge(props({
    PriceTypeAsk: PriceQuality.exclude(['Tradable', 'Indicative', 'OldIndicative']),
    AskSize: optional(literal(0)),

    PriceTypeBid: PriceQuality.exclude(['Tradable', 'Indicative', 'OldIndicative']),
    BidSize: optional(literal(0)),
  })),

  // Ask is given, bid is not given
  Base.merge(props({
    PriceTypeAsk: PriceQuality.extract(['Tradable', 'Indicative', 'OldIndicative']),
    Ask: number(),
    AskSize: number(),

    PriceTypeBid: PriceQuality.exclude(['Tradable', 'Indicative', 'OldIndicative']),
    BidSize: optional(literal(0)),
  })),

  // Ask is not given, bid is given
  Base.merge(props({
    PriceTypeAsk: PriceQuality.exclude(['Tradable', 'Indicative', 'OldIndicative']),
    AskSize: optional(literal(0)),

    PriceTypeBid: PriceQuality.extract(['Tradable', 'Indicative', 'OldIndicative']),
    Bid: number(),
    BidSize: number(),
  })),
])

export type Quote = GuardType<typeof Quote>
