import {
  type GuardType,
  integer,
  literal,
  optional,
  props,
  string,
} from 'https://raw.githubusercontent.com/systematic-trader/type-guard/main/mod.ts'
import { AssetType } from '../derives/asset-type.ts'
import { Commissions } from '../derives/commissions.ts'
import { Greeks } from '../derives/greeks.ts'
import { HistoricalChanges } from '../derives/historical-changes.ts'
import { InstrumentDisplayAndFormat } from '../derives/instrument-display-and-format.ts'
import { InstrumentPriceDetails } from '../derives/instrument-price-details.ts'
import { MarketDepth } from '../derives/market-depth.ts'
import { PriceInfoDetails } from '../derives/price-info-details.ts'
import { PriceInfo } from '../derives/price-info.ts'
import { Quote } from '../derives/quote.ts'
import { TradingErrorCode } from '../derives/trading-error-code.ts'

export const InfoPriceResponse = props({
  /** Asset Type of the instrument */
  AssetType: AssetType,

  /** The commissions */
  Commissions: optional(Commissions),

  /** Information about the instrument of the net position and how to display it. */
  DisplayAndFormat: InstrumentDisplayAndFormat.merge({
    /** Not documented */
    LotSizeText: optional(string()),
  }),

  /**
   * Error code, only there if instrument doesn't exist.
   *
   * Is usually None, but can indicate whether an order for that amount will be to large or to small.
   */
  ErrorCode: optional(TradingErrorCode),

  /** Error message, only there if instrument doesn't exist */
  ErrorMessage: optional(string()),

  /** The historical price changes */
  HistoricalChanges: optional(HistoricalChanges),

  /**
   * Instrument Specific Price Details.
   * Contents vary by AssetType
   */
  InstrumentPriceDetails: InstrumentPriceDetails,

  /** Time of last price update. */
  LastUpdated: string({ format: 'date-iso8601' }),

  /** The market depth */
  MarketDepth: optional(MarketDepth),

  /** Brief price information. */
  PriceInfo: PriceInfo,

  /** Detailed price information */
  PriceInfoDetails: optional(PriceInfoDetails),

  /** The source for the price information */
  PriceSource: optional(string()),

  /** The quote data. */
  Quote: Quote,

  /** Uic of instrument */
  Uic: integer(),
})

export interface InfoPriceResponse extends GuardType<typeof InfoPriceResponse> {}

export const InfoPriceResponseBond = InfoPriceResponse.merge({
  AssetType: literal('Bond'),
  PriceInfo: optional(PriceInfo),
  InstrumentPriceDetails: optional(InstrumentPriceDetails.pick([
    'AccruedInterest',
    'AskYield',
    'AverageVolume30Days',
    'BidYield',
    'IsMarketOpen',
    'MidYield',
    'PriceFeedType',
    'ShortTradeDisabled',
    'ValueDate',
    'IndexRatio',
  ])),
})

export interface InfoPriceResponseBond extends GuardType<typeof InfoPriceResponseBond> {}

export const InfoPriceResponseCfdOnIndex = InfoPriceResponse.merge({
  AssetType: literal('CfdOnIndex'),
  InstrumentPriceDetails: InstrumentPriceDetails.pick([
    'IsMarketOpen',
    'PaidCfdInterest',
    'ReceivedCfdInterest',
    'ShortTradeDisabled',
    'ValueDate',
  ]),
})

export interface InfoPriceResponseCfdOnIndex extends GuardType<typeof InfoPriceResponseCfdOnIndex> {}

export const InfoPriceResponseCompanyWarrant = InfoPriceResponse.merge({
  AssetType: literal('CompanyWarrant'),
  InstrumentPriceDetails: InstrumentPriceDetails.pick([
    'AverageVolume',
    'AverageVolume30Days',
    'IsMarketOpen',
    'RelativeVolume',
    'ShortTradeDisabled',
    'ValueDate',
  ]),
})

export interface InfoPriceResponseCompanyWarrant extends GuardType<typeof InfoPriceResponseCompanyWarrant> {}

export const InfoPriceResponseCfdOnCompanyWarrant = InfoPriceResponse.merge({
  AssetType: literal('CfdOnCompanyWarrant'),
  InstrumentPriceDetails: InstrumentPriceDetails.pick([
    'AverageVolume',
    'AverageVolume30Days',
    'CfdBorrowingCost',
    'IsMarketOpen',
    'PaidCfdInterest',
    'ReceivedCfdInterest',
    'RelativeVolume',
    'ShortTradeDisabled',
    'ValueDate',
  ]),
})

export interface InfoPriceResponseCfdOnCompanyWarrant extends GuardType<typeof InfoPriceResponseCfdOnCompanyWarrant> {}

export const InfoPriceResponseStock = InfoPriceResponse.merge({
  AssetType: literal('Stock'),
  InstrumentPriceDetails: InstrumentPriceDetails.pick([
    'AverageVolume',
    'AverageVolume30Days',
    'IsMarketOpen',
    'RelativeVolume',
    'ShortTradeDisabled',
    'ValueDate',
  ]),
})

export interface InfoPriceResponseStock extends GuardType<typeof InfoPriceResponseStock> {}

export const InfoPriceResponseCfdOnStock = InfoPriceResponse.merge({
  AssetType: literal('CfdOnStock'),
  InstrumentPriceDetails: InstrumentPriceDetails.pick([
    'AverageVolume',
    'AverageVolume30Days',
    'CfdBorrowingCost',
    'IsMarketOpen',
    'PaidCfdInterest',
    'ReceivedCfdInterest',
    'RelativeVolume',
    'ShortTradeDisabled',
    'ValueDate',
  ]),
})

export interface InfoPriceResponseCfdOnStock extends GuardType<typeof InfoPriceResponseCfdOnStock> {}

export const InfoPriceResponseStockIndexOption = InfoPriceResponse.merge({
  AssetType: literal('StockIndexOption'),
  InstrumentPriceDetails: optional(InstrumentPriceDetails.pick([
    'IsMarketOpen',
    'OpenInterest',
    'ShortTradeDisabled',
    'ValueDate',
  ])),
  PriceInfo: optional(PriceInfo),
  Greeks: optional(Greeks),
})

export interface InfoPriceResponseStockIndexOption extends GuardType<typeof InfoPriceResponseStockIndexOption> {}

export const InfoPriceResponseStockOption = InfoPriceResponse.merge({
  AssetType: literal('StockOption'),
  InstrumentPriceDetails: InstrumentPriceDetails.pick([
    'IsMarketOpen',
    'OpenInterest',
    'ShortTradeDisabled',
    'ValueDate',
  ]),
  Greeks: optional(Greeks),
})

export interface InfoPriceResponseStockOption extends GuardType<typeof InfoPriceResponseStockOption> {}

export const InfoPriceResponseContractFutures = InfoPriceResponse.merge({
  AssetType: literal('ContractFutures'),
  InstrumentPriceDetails: InstrumentPriceDetails.pick([
    'AverageVolume',
    'IsMarketOpen',
    'NoticeDate',
    'OpenInterest',
    'RelativeVolume',
    'ShortTradeDisabled',
    'ValueDate',
  ]),
})

export interface InfoPriceResponseContractFutures extends GuardType<typeof InfoPriceResponseContractFutures> {}

export const InfoPriceResponseCfdOnFutures = InfoPriceResponse.merge({
  AssetType: literal('CfdOnFutures'),
  PriceInfo: optional(PriceInfo),
  InstrumentPriceDetails: optional(InstrumentPriceDetails.pick([
    'IsMarketOpen',
    'ShortTradeDisabled',
    'ValueDate',
  ])),
})

export interface InfoPriceResponseCfdOnFutures extends GuardType<typeof InfoPriceResponseCfdOnFutures> {}

export const InfoPriceResponseEtc = InfoPriceResponse.merge({
  AssetType: literal('Etc'),
  InstrumentPriceDetails: InstrumentPriceDetails.pick([
    'AverageVolume',
    'AverageVolume30Days',
    'IsMarketOpen',
    'RelativeVolume',
    'ShortTradeDisabled',
    'ValueDate',
  ]),
})

export interface InfoPriceResponseEtc extends GuardType<typeof InfoPriceResponseEtc> {}

export const InfoPriceResponseCfdOnEtc = InfoPriceResponse.merge({
  AssetType: literal('CfdOnEtc'),
  InstrumentPriceDetails: InstrumentPriceDetails.pick([
    'AverageVolume',
    'AverageVolume30Days',
    'CfdBorrowingCost',
    'IsMarketOpen',
    'PaidCfdInterest',
    'ReceivedCfdInterest',
    'RelativeVolume',
    'ShortTradeDisabled',
    'ValueDate',
  ]),
})

export interface InfoPriceResponseCfdOnEtc extends GuardType<typeof InfoPriceResponseCfdOnEtc> {}

export const InfoPriceResponseEtf = InfoPriceResponse.merge({
  AssetType: literal('Etf'),
  InstrumentPriceDetails: InstrumentPriceDetails.pick([
    'AverageVolume',
    'AverageVolume30Days',
    'IsMarketOpen',
    'RelativeVolume',
    'ShortTradeDisabled',
    'ValueDate',
  ]),
})

export interface InfoPriceResponseEtf extends GuardType<typeof InfoPriceResponseEtf> {}

export const InfoPriceResponseCfdOnEtf = InfoPriceResponse.merge({
  AssetType: literal('CfdOnEtf'),
  InstrumentPriceDetails: InstrumentPriceDetails.pick([
    'AverageVolume',
    'AverageVolume30Days',
    'CfdBorrowingCost',
    'IsMarketOpen',
    'PaidCfdInterest',
    'ReceivedCfdInterest',
    'RelativeVolume',
    'ShortTradeDisabled',
    'ValueDate',
  ]),
})

export interface InfoPriceResponseCfdOnEtf extends GuardType<typeof InfoPriceResponseCfdOnEtf> {}

export const InfoPriceResponseEtn = InfoPriceResponse.merge({
  AssetType: literal('Etn'),
  InstrumentPriceDetails: InstrumentPriceDetails.pick([
    'AverageVolume',
    'AverageVolume30Days',
    'IsMarketOpen',
    'RelativeVolume',
    'ShortTradeDisabled',
    'ValueDate',
  ]),
})

export interface InfoPriceResponseEtn extends GuardType<typeof InfoPriceResponseEtn> {}

export const InfoPriceResponseCfdOnEtn = InfoPriceResponse.merge({
  AssetType: literal('CfdOnEtn'),
  InstrumentPriceDetails: InstrumentPriceDetails.pick([
    'AverageVolume',
    'AverageVolume30Days',
    'CfdBorrowingCost',
    'IsMarketOpen',
    'PaidCfdInterest',
    'ReceivedCfdInterest',
    'RelativeVolume',
    'ShortTradeDisabled',
    'ValueDate',
  ]),
})

export interface InfoPriceResponseCfdOnEtn extends GuardType<typeof InfoPriceResponseCfdOnEtn> {}

export const InfoPriceResponseFund = InfoPriceResponse.merge({
  AssetType: literal('Fund'),
  InstrumentPriceDetails: InstrumentPriceDetails.pick([
    'AverageVolume',
    'AverageVolume30Days',
    'IsMarketOpen',
    'RelativeVolume',
    'ShortTradeDisabled',
    'ValueDate',
  ]),
})

export interface InfoPriceResponseFund extends GuardType<typeof InfoPriceResponseFund> {}

export const InfoPriceResponseCfdOnFund = InfoPriceResponse.merge({
  AssetType: literal('CfdOnFund'),
  InstrumentPriceDetails: InstrumentPriceDetails.pick([
    'AverageVolume',
    'AverageVolume30Days',
    'CfdBorrowingCost',
    'IsMarketOpen',
    'PaidCfdInterest',
    'ReceivedCfdInterest',
    'RelativeVolume',
    'ShortTradeDisabled',
    'ValueDate',
  ]),
})

export interface InfoPriceResponseCfdOnFund extends GuardType<typeof InfoPriceResponseCfdOnFund> {}

export const InfoPriceResponseFuturesOption = InfoPriceResponse.merge({
  AssetType: literal('FuturesOption'),
  InstrumentPriceDetails: InstrumentPriceDetails.pick([
    'IsMarketOpen',
    'OpenInterest',
    'ShortTradeDisabled',
    'ValueDate',
  ]),
  Greeks: optional(Greeks),
})

export interface InfoPriceResponseFuturesOption extends GuardType<typeof InfoPriceResponseFuturesOption> {}

export const InfoPriceResponseFxForwards = InfoPriceResponse.omit(['PriceInfo']).merge({
  AssetType: literal('FxForwards'),
  InstrumentPriceDetails: InstrumentPriceDetails.pick([
    'IsMarketOpen',
    'ShortTradeDisabled',
    'SpotAsk',
    'SpotBid',
    'SpotDate',
    'SwapAsk',
    'SwapBid',
    'ValueDate',
  ]),
  Greeks: optional(Greeks),
})

export interface InfoPriceResponseFxForwards extends GuardType<typeof InfoPriceResponseFxForwards> {}

export const InfoPriceResponseFxNoTouchOption = InfoPriceResponse.merge({
  AssetType: literal('FxNoTouchOption'),
  PriceInfo: optional(PriceInfo.omit(['High', 'Low', 'NetChange', 'PercentChange'])),
  InstrumentPriceDetails: InstrumentPriceDetails.pick([
    'ExpiryDate',
    'IsMarketOpen',
    'MidForwardPrice',
    'MidSpotPrice',
    'ShortTradeDisabled',
    'SpotAsk',
    'SpotBid',
    'SpotDate',
    'ValueDate',
  ]),
  Greeks: optional(Greeks),
})

export interface InfoPriceResponseFxNoTouchOption extends GuardType<typeof InfoPriceResponseFxNoTouchOption> {}

export const InfoPriceResponseFxOneTouchOption = InfoPriceResponse.merge({
  AssetType: literal('FxOneTouchOption'),
  PriceInfo: optional(PriceInfo.omit(['High', 'Low', 'NetChange', 'PercentChange'])),
  InstrumentPriceDetails: InstrumentPriceDetails.pick([
    'ExpiryDate',
    'IsMarketOpen',
    'MidForwardPrice',
    'MidSpotPrice',
    'ShortTradeDisabled',
    'SpotAsk',
    'SpotBid',
    'SpotDate',
    'ValueDate',
  ]),
  Greeks: optional(Greeks),
})

export interface InfoPriceResponseFxOneTouchOption extends GuardType<typeof InfoPriceResponseFxOneTouchOption> {}

export const InfoPriceResponseFxSpot = InfoPriceResponse.merge({
  AssetType: literal('FxSpot'),
  InstrumentPriceDetails: InstrumentPriceDetails.pick([
    'IsMarketOpen',
    'ShortTradeDisabled',
    'ValueDate',
  ]),
  Greeks: optional(Greeks),
})

export interface InfoPriceResponseFxSpot extends GuardType<typeof InfoPriceResponseFxSpot> {}

export const InfoPriceResponseFxSwap = InfoPriceResponse.omit(['PriceInfo']).merge({
  AssetType: literal('FxSwap'),
  InstrumentPriceDetails: InstrumentPriceDetails.pick([
    'FarLegAsk',
    'FarLegBid',
    'FarLegMidPrice',
    'ForwardDateFarLeg',
    'ForwardDateNearLeg',
    'IsMarketOpen',
    'NearLegMidPrice',
    'ShortTradeDisabled',
    'SpotAsk',
    'SpotBid',
    'SwapAsk',
    'SwapBid',
    'ValueDate',
  ]),
  Greeks: optional(Greeks),
})

export interface InfoPriceResponseFxSwap extends GuardType<typeof InfoPriceResponseFxSwap> {}

export const InfoPriceResponseFxVanillaOption = InfoPriceResponse.omit(['PriceInfo']).merge({
  AssetType: literal('FxVanillaOption'),
  InstrumentPriceDetails: InstrumentPriceDetails.pick([
    'ExpiryDate',
    'IsMarketOpen',
    'MidForwardPrice',
    'MidSpotPrice',
    'ShortTradeDisabled',
    'SpotAsk',
    'SpotBid',
    'SpotDate',
    'ValueDate',
  ]),
  Greeks: optional(Greeks),
})

export interface InfoPriceResponseFxVanillaOption extends GuardType<typeof InfoPriceResponseFxVanillaOption> {}

export const InfoPriceResponseRights = InfoPriceResponse.merge({
  AssetType: literal('Rights'),
  InstrumentPriceDetails: InstrumentPriceDetails.pick([
    'AverageVolume',
    'AverageVolume30Days',
    'IsMarketOpen',
    'RelativeVolume',
    'ShortTradeDisabled',
    'ValueDate',
  ]),
})

export interface InfoPriceResponseRights extends GuardType<typeof InfoPriceResponseRights> {}

export const InfoPriceResponseCfdOnRights = InfoPriceResponse.merge({
  AssetType: literal('CfdOnRights'),
  InstrumentPriceDetails: InstrumentPriceDetails.pick([
    'AverageVolume',
    'AverageVolume30Days',
    'CfdBorrowingCost',
    'CfdPriceAdjustment',
    'IsMarketOpen',
    'PaidCfdInterest',
    'ReceivedCfdInterest',
    'ShortTradeDisabled',
    'ValueDate',
  ]),
})

export interface InfoPriceResponseCfdOnRights extends GuardType<typeof InfoPriceResponseCfdOnRights> {}
