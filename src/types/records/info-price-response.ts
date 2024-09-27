import {
  type GuardType,
  integer,
  optional,
  props,
  string,
} from 'https://raw.githubusercontent.com/systematic-trader/type-guard/main/mod.ts'
import { AssetType } from '../derives/asset-type.ts'
import { InstrumentDisplayAndFormat } from '../derives/instrument-display-and-format.ts'
import { Commissions } from '../derives/commissions.ts'
import { TradingErrorCode } from '../derives/trading-error-code.ts'
import { HistoricalChanges } from '../derives/historical-changes.ts'
import { InstrumentPriceDetails } from '../derives/instrument-price-details.ts'
import { MarketDepth } from '../derives/market-depth.ts'
import { PriceInfo } from '../derives/price-info.ts'
import { PriceInfoDetails } from '../derives/price-info-details.ts'
import { Quote } from '../derives/quote.ts'

export const InfoPriceResponse = props({
  /** Asset Type of the instrument */
  AssetType: AssetType,

  /** The commissions */
  Commissions: Commissions,

  /** Information about the instrument of the net position and how to display it. */
  DisplayAndFormat: InstrumentDisplayAndFormat.merge({
    /** Not documented */
    LotSizeText: optional(string()),
  }),

  /** Error code, only there if instrument doesn't exist */
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
  PriceInfoDetails: PriceInfoDetails,

  /** The source for the price information */
  PriceSource: string(),

  /** The quote data. */
  Quote: Quote,

  /** Uic of instrument */
  Uic: integer(),
})

export interface InfoPriceResponse extends GuardType<typeof InfoPriceResponse> {}
