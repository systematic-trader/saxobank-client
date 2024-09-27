import {
  array,
  boolean,
  type GuardType,
  integer,
  nullable,
  number,
  props,
  string,
} from 'https://raw.githubusercontent.com/systematic-trader/type-guard/main/mod.ts'
import { PriceSourceType } from './price-source-type.ts'

export interface MarketDepth extends GuardType<typeof MarketDepth> {}

/**
 * Contains information about the market depth.
 *
 * Price values are depending on a subscription to a feed.
 * This can mean no data, delayed data or real time data dependent on the callers subscription setup.
 */
export const MarketDepth = props({
  /** List of prices of the current offers to sell in the market. */
  Ask: array(number()),

  /** List of order counts of the current offers to sell in the market. */
  AskOrders: array(number()),

  /** List of amounts of the current offers to sell in the market. */
  AskSize: array(number()),

  /** List of prices of the current offers to buy in the market. */
  Bid: array(number()),

  /** List of order counts of the current offers to buy in the market. */
  BidOrders: array(number()),

  /** List of amounts of the current offers to buy in the market. */
  BidSize: array(number()),

  /** Number of current bids on the instrument. */
  NoOfBids: integer(),

  /** Number of current offers on the instrument. */
  NoOfOffers: integer(),

  /** Using Orders. */
  UsingOrders: boolean(),

  /** Not documented */
  AskPriceSourceTypes: array(nullable(PriceSourceType)),

  /** Not documented */
  AskPriceSources: array(nullable(string())),

  /** Not documented */
  BidPriceSourceTypes: array(nullable(PriceSourceType)),

  /** Not documented */
  BidPriceSources: array(nullable(string())),

  /** Not documented */
  Level2PriceFeed: boolean(),
})
