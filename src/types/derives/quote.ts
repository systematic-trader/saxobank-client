import {
  type GuardType,
  integer,
  number,
  optional,
  props,
  string,
} from 'https://raw.githubusercontent.com/systematic-trader/type-guard/main/mod.ts'
import { ErrorCode } from './error-code.ts'
import { MarketState } from './market-state.ts'
import { PriceQuality } from './price-quality.ts'
import { PriceSourceType } from './price-source-type.ts'

export interface Quote extends GuardType<typeof Quote> {}

/**
 * Additional information related to the instrument
 *
 * Price values are depending on a subscription to a feed.
 * This can mean no data, delayed data or real time data dependent on the callers subscription setup.
 */
export const Quote = props({
  /** The amount for which the quote is calculated. */
  Amount: integer(),

  /** The ask price. */
  Ask: number(),

  /** The ask size. */
  AskSize: number(),

  /** The bid price. */
  Bid: number(),

  /** The bid size. */
  BidSize: number(),

  /** If set, it defines the number of minutes by which the price is delayed. */
  DelayedByMinutes: integer(),

  /** Gets or sets the error code. */
  ErrorCode: ErrorCode,

  /** Not documented */
  MarketState: MarketState,

  /** The mid price. */
  Mid: number(),

  /** The source for the price information */
  PriceSource: string(),

  /** The price type for ask. */
  PriceTypeAsk: PriceQuality,

  /** The price type for bid. */
  PriceTypeBid: PriceQuality,

  /**
   * Suggested price based on best available price information.
   * Typically used as suggested price when exchange is closed.
   */
  ReferencePrice: optional(number()),

  /** Not documented */
  PriceSourceType: PriceSourceType,
})
