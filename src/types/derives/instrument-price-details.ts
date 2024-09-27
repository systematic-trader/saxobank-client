import {
  boolean,
  enums,
  type GuardType,
  number,
  optional,
  props,
  string,
} from 'https://raw.githubusercontent.com/systematic-trader/type-guard/main/mod.ts'

export interface InstrumentPriceDetails extends GuardType<typeof InstrumentPriceDetails> {}

export const InstrumentPriceDetails = props({
  /**
   * Accrued Interest.
   * Valid for: Bonds
   */
  AccruedInterest: number(),

  /** AskYield are only valid for the bond asset type */
  AskYield: number(),

  /** BidYield are only valid for the bond asset type */
  BidYield: number(),

  /** Costs applicable to shorting the CFD */
  CfdBorrowingCost: number(),

  /** A rate relevant for certain long cfd positions */
  CfdHardToFinanceRate: number(),

  /**
   * Is returned as true when the instrument subscribed for is a CFD and the user is on a special mark-up price configuration.
   * If true, the values in EstPriceBuy and EstPriceSell are relevant (but still only provided given a share price)
   */
  CfdPriceAdjustment: boolean(),

  /**
   * Trade is routed to trading venue.
   * Trade on quote not allowed.
   */
  Dma: boolean(),

  /**
   * May be returned when the instrument subscribed for is a CFD on a stock and the user is set up to trade on the share price, but pay a markup on top.
   * In that case the EstPriceBuy is the markup paied for an eventual buy order.
   * Not relevant for info prices.
   *
   * Price values are depending on a subscription to a feed.
   * This can mean no data, delayed data or real time data dependent on the callers subscription setup.
   */
  EstPriceBuy: number(),

  /**
   * May be returned when the instrument subscribed for is a CFD and the user is set up to trade on the share price, but pay a markup on top.
   * In that case the EstPriceSell is the markup paied for an eventual sell order.
   * Not relevant for info prices.
   *
   * Price values are depending on a subscription to a feed.
   * This can mean no data, delayed data or real time data dependent on the callers subscription setup.
   */
  EstPriceSell: number(),

  /**
   * Expiry date for contract.
   * Valid for: CFD Futures, FxOptions
   */
  ExpiryDate: string({ format: 'date-iso8601' }),

  /**
   * The far leg value date.
   * Applicable for FxSwap
   */
  ForwardDateFarLeg: string({ format: 'date-iso8601' }),

  /**
   * The near leg value date.
   * Applicable for FxSwap
   */
  ForwardDateNearLeg: string({ format: 'date-iso8601' }),

  /** IndexRatio, Applicable for inflation linked bond */
  IndexRatio: number(),

  /** Gets or sets a value indicating whether the market on which the instrument is traded is currently open */
  IsMarketOpen: boolean(),

  /**
   * Lower Barrier.
   * Valid for: FX One Touch, No TouchOptions and certian derivatives such as Turbos */
  LowerBarrier: number(),

  /** The mid forward price */
  MidForwardPrice: number(),

  /**
   * The post mid price.
   * Valid for: Fx Options
   */
  MidSpotPrice: number(),

  /** MidYield are only valid for the bond asset type */
  MidYield: number(),

  /** Futures only - The date on which the owner may be required to take physical delivery of the instrument commodity */
  NoticeDate: string({ format: 'gregorian-date' }),

  /** The number of currently open contracts (available for contract options and futures) */
  OpenInterest: number(),

  /** A rate representing the interest to be paid when holding a CFD short position overnight */
  PaidCfdInterest: number(),

  /** A rate representing the interest to be paid when holding a SRD short position overnight */
  PaidSrdInterest: number(),

  /** Premium date */
  PremiumDate: string({ format: 'date-iso8601' }),

  /** A rate representing the interest received when with holding a CFD long position overnight */
  ReceivedCfdInterest: number(),

  /** A rate representing the interest received when with holding a SRD long position overnight */
  ReceivedSrdInterest: number(),

  /** Set to true if short trading is disabled for this instrument */
  ShortTradeDisabled: boolean(),

  /**
   * The spot ask price.
   * Valid for: FX Forwards.
   */
  SpotAsk: number(),

  /**
   * The post bid price.
   * Valid for: Fx Forwards. */
  SpotBid: number(),

  /**
   * The Spot Date.
   * Valid for Fx Forwards. */
  SpotDate: string({ format: 'gregorian-date' }),

  /** Liquidation/Last Trade Date of the SRD */
  SrdLastTradeDate: string({ format: 'date-iso8601' }),

  /** Settlement Date of the SRD */
  SrdSettlementDate: string({ format: 'date-iso8601' }),

  /** Option Strike Price */
  StrikePrice: number(),

  /** Swap rate for ask, Valid for: FxForwards and FxSwap */
  SwapAsk: number(),

  /** Swap rate for bid, Valid for: FxForwards and FxSwap */
  SwapBid: number(),

  /**
   * Upper Barrier.
   * Valid for: FX One Touch, No TouchOptions and certian derivatives such as Turbos.
   */
  UpperBarrier: number(),

  /** Actual ValueDate (could be different from what was specified in request due to holidays etc.) */
  ValueDate: string({ format: 'gregorian-date' }),

  /** Not documented */
  AverageVolume30Days: number(),

  /** Not documented */
  AverageVolume: number(),

  /** Not documented */
  RelativeVolume: optional(number()),

  /** Not documented */
  PriceFeedType: optional(enums(['Consolidated'])),
})

export const InstrumentPriceDetailsBond = InstrumentPriceDetails.pick([
  'AccruedInterest',
  'AskYield',
  'AverageVolume30Days',
  'BidYield',
  'IsMarketOpen',
  'MidYield',
  'PriceFeedType',
  'ShortTradeDisabled',
  'ValueDate',
])

export interface InstrumentPriceDetailsBond extends GuardType<typeof InstrumentPriceDetailsBond> {}

export const InstrumentPriceDetailsCfdOnIndex = InstrumentPriceDetails.pick([
  'IsMarketOpen',
  'PaidCfdInterest',
  'ReceivedCfdInterest',
  'ShortTradeDisabled',
  'ValueDate',
])

export interface InstrumentPriceDetailsCfdOnIndex extends GuardType<typeof InstrumentPriceDetailsCfdOnIndex> {}

export const InstrumentPriceDetailsCompanyWarrant = InstrumentPriceDetails.pick([
  'AverageVolume',
  'AverageVolume30Days',
  'IsMarketOpen',
  'RelativeVolume',
  'ShortTradeDisabled',
  'ValueDate',
])

export interface InstrumentPriceDetailsCompanyWarrant extends GuardType<typeof InstrumentPriceDetailsCompanyWarrant> {}

export const InstrumentPriceDetailsCfdOnCompanyWarrant = InstrumentPriceDetails.pick([
  'AverageVolume',
  'AverageVolume30Days',
  'CfdBorrowingCost',
  'IsMarketOpen',
  'PaidCfdInterest',
  'ReceivedCfdInterest',
  'RelativeVolume',
  'ShortTradeDisabled',
  'ValueDate',
])

export interface InstrumentPriceDetailsCfdOnCompanyWarrant
  extends GuardType<typeof InstrumentPriceDetailsCfdOnCompanyWarrant> {}

export const InstrumentPriceDetailsStock = InstrumentPriceDetails.pick([
  'AverageVolume',
  'AverageVolume30Days',
  'IsMarketOpen',
  'RelativeVolume',
  'ShortTradeDisabled',
  'ValueDate',
])

export interface InstrumentPriceDetailsStock extends GuardType<typeof InstrumentPriceDetailsStock> {}

export const InstrumentPriceDetailsCfdOnStock = InstrumentPriceDetails.pick([
  'AverageVolume',
  'AverageVolume30Days',
  'CfdBorrowingCost',
  'IsMarketOpen',
  'PaidCfdInterest',
  'ReceivedCfdInterest',
  'RelativeVolume',
  'ShortTradeDisabled',
  'ValueDate',
])

export interface InstrumentPriceDetailsCfdOnStock extends GuardType<typeof InstrumentPriceDetailsCfdOnStock> {}

export const InstrumentPriceDetailsStockIndexOption = InstrumentPriceDetails.pick([
  'IsMarketOpen',
  'OpenInterest',
  'ShortTradeDisabled',
  'ValueDate',
])

export interface InstrumentPriceDetailsStockIndexOption
  extends GuardType<typeof InstrumentPriceDetailsStockIndexOption> {}

export const InstrumentPriceDetailsStockOption = InstrumentPriceDetails.pick([
  'IsMarketOpen',
  'OpenInterest',
  'ShortTradeDisabled',
  'ValueDate',
])

export interface InstrumentPriceDetailsStockOption extends GuardType<typeof InstrumentPriceDetailsStockOption> {}

export const InstrumentPriceDetailsContractFutures = InstrumentPriceDetails.pick([
  'AverageVolume',
  'IsMarketOpen',
  'NoticeDate',
  'OpenInterest',
  'RelativeVolume',
  'ShortTradeDisabled',
  'ValueDate',
])

export interface InstrumentPriceDetailsContractFutures
  extends GuardType<typeof InstrumentPriceDetailsContractFutures> {}

export const InstrumentPriceDetailsCfdOnFutures = InstrumentPriceDetails.pick([
  'IsMarketOpen',
  'ShortTradeDisabled',
  'ValueDate',
])

export interface InstrumentPriceDetailsCfdOnFutures extends GuardType<typeof InstrumentPriceDetailsCfdOnFutures> {}

export const InstrumentPriceDetailsEtc = InstrumentPriceDetails.pick([
  'AverageVolume',
  'AverageVolume30Days',
  'IsMarketOpen',
  'RelativeVolume',
  'ShortTradeDisabled',
  'ValueDate',
])

export interface InstrumentPriceDetailsEtc extends GuardType<typeof InstrumentPriceDetailsEtc> {}

export const InstrumentPriceDetailsCfdOnEtc = InstrumentPriceDetails.pick([
  'AverageVolume',
  'AverageVolume30Days',
  'CfdBorrowingCost',
  'IsMarketOpen',
  'PaidCfdInterest',
  'ReceivedCfdInterest',
  'RelativeVolume',
  'ShortTradeDisabled',
  'ValueDate',
])

export interface InstrumentPriceDetailsCfdOnEtc extends GuardType<typeof InstrumentPriceDetailsCfdOnEtc> {}

export const InstrumentPriceDetailsEtf = InstrumentPriceDetails.pick([
  'AverageVolume',
  'AverageVolume30Days',
  'IsMarketOpen',
  'RelativeVolume',
  'ShortTradeDisabled',
  'ValueDate',
])

export interface InstrumentPriceDetailsEtf extends GuardType<typeof InstrumentPriceDetailsEtf> {}

export const InstrumentPriceDetailsCfdOnEtf = InstrumentPriceDetails.pick([
  'AverageVolume',
  'AverageVolume30Days',
  'CfdBorrowingCost',
  'IsMarketOpen',
  'PaidCfdInterest',
  'ReceivedCfdInterest',
  'RelativeVolume',
  'ShortTradeDisabled',
  'ValueDate',
])

export interface InstrumentPriceDetailsCfdOnEtf extends GuardType<typeof InstrumentPriceDetailsCfdOnEtf> {}

export const InstrumentPriceDetailsEtn = InstrumentPriceDetails.pick([
  'AverageVolume',
  'AverageVolume30Days',
  'IsMarketOpen',
  'RelativeVolume',
  'ShortTradeDisabled',
  'ValueDate',
])

export interface InstrumentPriceDetailsEtn extends GuardType<typeof InstrumentPriceDetailsEtn> {}

export const InstrumentPriceDetailsCfdOnEtn = InstrumentPriceDetails.pick([
  'AverageVolume',
  'AverageVolume30Days',
  'CfdBorrowingCost',
  'IsMarketOpen',
  'PaidCfdInterest',
  'ReceivedCfdInterest',
  'RelativeVolume',
  'ShortTradeDisabled',
  'ValueDate',
])

export interface InstrumentPriceDetailsCfdOnEtn extends GuardType<typeof InstrumentPriceDetailsCfdOnEtn> {}

export const InstrumentPriceDetailsFund = InstrumentPriceDetails.pick([
  'AverageVolume',
  'AverageVolume30Days',
  'IsMarketOpen',
  'RelativeVolume',
  'ShortTradeDisabled',
  'ValueDate',
])

export interface InstrumentPriceDetailsFund extends GuardType<typeof InstrumentPriceDetailsFund> {}

export const InstrumentPriceDetailsCfdOnFund = InstrumentPriceDetails.pick([
  'AverageVolume',
  'AverageVolume30Days',
  'CfdBorrowingCost',
  'IsMarketOpen',
  'PaidCfdInterest',
  'ReceivedCfdInterest',
  'RelativeVolume',
  'ShortTradeDisabled',
  'ValueDate',
])

export interface InstrumentPriceDetailsCfdOnFund extends GuardType<typeof InstrumentPriceDetailsCfdOnFund> {}

export const InstrumentPriceDetailsFuturesOption = InstrumentPriceDetails.pick([
  'IsMarketOpen',
  'OpenInterest',
  'ShortTradeDisabled',
  'ValueDate',
])

export interface InstrumentPriceDetailsFuturesOption extends GuardType<typeof InstrumentPriceDetailsFuturesOption> {}

export interface InstrumentPriceDetailsFxForwards extends GuardType<typeof InstrumentPriceDetailsFxForwards> {}

export const InstrumentPriceDetailsFxForwards = InstrumentPriceDetails.pick([
  'IsMarketOpen',
  'ShortTradeDisabled',
  'SpotAsk',
  'SpotBid',
  'SpotDate',
  'SwapAsk',
  'SwapBid',
  'ValueDate',
])

export interface InstrumentPriceDetailsFxNoTouchOption
  extends GuardType<typeof InstrumentPriceDetailsFxNoTouchOption> {}

export const InstrumentPriceDetailsFxNoTouchOption = InstrumentPriceDetails.pick([
  //
])

export interface InstrumentPriceDetailsFxOneTouchOption
  extends GuardType<typeof InstrumentPriceDetailsFxOneTouchOption> {}

export const InstrumentPriceDetailsFxOneTouchOption = InstrumentPriceDetails.pick([
  //
])

export interface InstrumentPriceDetailsFxSpot extends GuardType<typeof InstrumentPriceDetailsFxSpot> {}

export const InstrumentPriceDetailsFxSpot = InstrumentPriceDetails.pick([
  //
])

export interface InstrumentPriceDetailsFxSwap extends GuardType<typeof InstrumentPriceDetailsFxSwap> {}

export const InstrumentPriceDetailsFxSwap = InstrumentPriceDetails.pick([
  //
])

export interface InstrumentPriceDetailsFxVanillaOption
  extends GuardType<typeof InstrumentPriceDetailsFxVanillaOption> {}

export const InstrumentPriceDetailsFxVanillaOption = InstrumentPriceDetails.pick([
  //
])
