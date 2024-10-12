import {
  array,
  boolean,
  type GuardType,
  integer,
  optional,
  props,
  string,
} from 'https://raw.githubusercontent.com/systematic-trader/type-guard/main/mod.ts'
import { AssetType } from '../derives/asset-type.ts'
import { CountryCodeA2 } from '../derives/country.ts'
import { Currency3 } from '../derives/currency.ts'
import { SummaryType } from '../derives/summary-type.ts'

export type InstrumentSummaryInfoType =
  | InstrumentSummaryInfoBond
  | InstrumentSummaryInfoCfdIndexOption
  | InstrumentSummaryInfoCfdOnCompanyWarrant
  | InstrumentSummaryInfoCfdOnEtc
  | InstrumentSummaryInfoCfdOnEtf
  | InstrumentSummaryInfoCfdOnEtn
  | InstrumentSummaryInfoCfdOnFund
  | InstrumentSummaryInfoCfdOnFutures
  | InstrumentSummaryInfoCfdOnIndex
  | InstrumentSummaryInfoCfdOnRights
  | InstrumentSummaryInfoCfdOnStock
  | InstrumentSummaryInfoCompanyWarrant
  | InstrumentSummaryInfoContractFutures
  | InstrumentSummaryInfoEtc
  | InstrumentSummaryInfoEtf
  | InstrumentSummaryInfoEtn
  | InstrumentSummaryInfoFund
  | InstrumentSummaryInfoFuturesOption
  | InstrumentSummaryInfoFuturesStrategy
  | InstrumentSummaryInfoFxSpot
  | InstrumentSummaryInfoFxSwap
  | InstrumentSummaryInfoFxVanillaOption
  | InstrumentSummaryInfoMutualFund
  | InstrumentSummaryInfoRights
  | InstrumentSummaryInfoStock
  | InstrumentSummaryInfoStockIndex
  | InstrumentSummaryInfoStockIndexOption
  | InstrumentSummaryInfoStockOption
  | InstrumentSummaryInfoFxForwards
  | InstrumentSummaryInfoFxNoTouchOption
  | InstrumentSummaryInfoFxOneTouchOption

export interface InstrumentSummaryInfoBond extends GuardType<typeof InstrumentSummaryInfoBond> {}
export const InstrumentSummaryInfoBond = props({
  AssetType: AssetType.extract(['Bond']),
  CurrencyCode: Currency3,
  Description: string(),
  ExchangeId: string(),
  GroupId: integer(),
  Identifier: integer(),
  IssuerCountry: CountryCodeA2,
  SummaryType: SummaryType,
  Symbol: string(),
  TradableAs: array(AssetType.extract(['Bond'])),
  UnderlyingAssetType: optional(AssetType.extract(['Stock', 'FxSpot'])),
  UnderlyingUic: optional(integer()),
})

export interface InstrumentSummaryInfoCfdIndexOption extends GuardType<typeof InstrumentSummaryInfoCfdIndexOption> {}
export const InstrumentSummaryInfoCfdIndexOption = props({
  AssetType: AssetType.extract(['CfdIndexOption']),
  CanParticipateInMultiLegOrder: boolean(),
  CurrencyCode: Currency3,
  Description: string(),
  ExchangeId: string(),
  GroupId: integer(),
  GroupOptionRootId: integer(),
  Identifier: integer(),
  SummaryType: SummaryType,
  Symbol: string(),
})

export interface InstrumentSummaryInfoCfdOnCompanyWarrant
  extends GuardType<typeof InstrumentSummaryInfoCfdOnCompanyWarrant> {}
export const InstrumentSummaryInfoCfdOnCompanyWarrant = props({
  AssetType: AssetType.extract(['CfdOnCompanyWarrant']),
  CurrencyCode: Currency3,
  Description: string(),
  ExchangeId: string(),
  GroupId: integer(),
  Identifier: integer(),
  IssuerCountry: CountryCodeA2,
  PrimaryListing: optional(integer()),
  SummaryType: SummaryType,
  Symbol: string(),
  TradableAs: array(AssetType.extract(['CfdOnCompanyWarrant'])),
})

export interface InstrumentSummaryInfoCfdOnEtc extends GuardType<typeof InstrumentSummaryInfoCfdOnEtc> {}
export const InstrumentSummaryInfoCfdOnEtc = props({
  AssetType: AssetType.extract(['CfdOnEtc']),
  CurrencyCode: Currency3,
  Description: string(),
  ExchangeId: string(),
  GroupId: integer(),
  Identifier: integer(),
  IssuerCountry: CountryCodeA2,
  PrimaryListing: optional(integer()),
  SummaryType: SummaryType,
  Symbol: string(),
  TradableAs: array(AssetType.extract(['CfdOnEtc'])),
})

export interface InstrumentSummaryInfoCfdOnEtf extends GuardType<typeof InstrumentSummaryInfoCfdOnEtf> {}
export const InstrumentSummaryInfoCfdOnEtf = props({
  AssetType: AssetType.extract(['CfdOnEtf']),
  CurrencyCode: Currency3,
  Description: string(),
  ExchangeId: string(),
  GroupId: integer(),
  Identifier: integer(),
  IssuerCountry: CountryCodeA2,
  PrimaryListing: optional(integer()),
  SummaryType: SummaryType,
  Symbol: string(),
  TradableAs: array(AssetType.extract(['CfdOnEtf'])),
})

export interface InstrumentSummaryInfoCfdOnEtn extends GuardType<typeof InstrumentSummaryInfoCfdOnEtn> {}
export const InstrumentSummaryInfoCfdOnEtn = props({
  AssetType: AssetType.extract(['CfdOnEtn']),
  CurrencyCode: Currency3,
  Description: string(),
  ExchangeId: string(),
  GroupId: integer(),
  Identifier: integer(),
  IssuerCountry: CountryCodeA2,
  PrimaryListing: optional(integer()),
  SummaryType: SummaryType,
  Symbol: string(),
  TradableAs: array(AssetType.extract(['CfdOnEtn'])),
})

export interface InstrumentSummaryInfoCfdOnFund extends GuardType<typeof InstrumentSummaryInfoCfdOnFund> {}
export const InstrumentSummaryInfoCfdOnFund = props({
  AssetType: AssetType.extract(['CfdOnFund']),
  CurrencyCode: Currency3,
  Description: string(),
  ExchangeId: string(),
  GroupId: integer(),
  Identifier: integer(),
  IssuerCountry: CountryCodeA2,
  PrimaryListing: optional(integer()),
  SummaryType: SummaryType,
  Symbol: string(),
  TradableAs: optional(array(AssetType.extract(['CfdOnFund']))),
})

export interface InstrumentSummaryInfoCfdOnFutures extends GuardType<typeof InstrumentSummaryInfoCfdOnFutures> {}
export const InstrumentSummaryInfoCfdOnFutures = props({
  AssetType: AssetType.extract(['CfdOnFutures']),
  CurrencyCode: Currency3,
  Description: string(),
  DisplayHint: optional(string()),
  GroupId: integer(),
  Identifier: integer(),
  PrimaryListing: integer(),
  SummaryType: SummaryType,
  Symbol: string(),
  TradableAs: array(AssetType.extract(['CfdOnFutures'])),
  UnderlyingUic: integer(),
})

export interface InstrumentSummaryInfoCfdOnIndex extends GuardType<typeof InstrumentSummaryInfoCfdOnIndex> {}
export const InstrumentSummaryInfoCfdOnIndex = props({
  AssetType: AssetType.extract(['CfdOnIndex']),
  CurrencyCode: Currency3,
  Description: string(),
  GroupId: integer(),
  Identifier: integer(),
  SummaryType: SummaryType,
  Symbol: string(),
  TradableAs: array(AssetType.extract(['CfdOnIndex'])),
  UnderlyingUic: integer(),
})

export interface InstrumentSummaryInfoCfdOnRights extends GuardType<typeof InstrumentSummaryInfoCfdOnRights> {}
export const InstrumentSummaryInfoCfdOnRights = props({
  AssetType: AssetType.extract(['CfdOnRights']),
  CurrencyCode: Currency3,
  Description: string(),
  ExchangeId: string(),
  GroupId: integer(),
  Identifier: integer(),
  IssuerCountry: CountryCodeA2,
  SummaryType: SummaryType,
  Symbol: string(),
  TradableAs: array(AssetType.extract(['CfdOnRights'])),
})

export interface InstrumentSummaryInfoCfdOnStock extends GuardType<typeof InstrumentSummaryInfoCfdOnStock> {}
export const InstrumentSummaryInfoCfdOnStock = props({
  AssetType: AssetType.extract(['CfdOnStock']),
  CurrencyCode: Currency3,
  Description: string(),
  ExchangeId: string(),
  GroupId: integer(),
  Identifier: integer(),
  IssuerCountry: CountryCodeA2,
  PrimaryListing: optional(integer()),
  SummaryType: SummaryType,
  Symbol: string(),
  TradableAs: array(AssetType.extract(['CfdOnStock'])),
})

export interface InstrumentSummaryInfoCompanyWarrant extends GuardType<typeof InstrumentSummaryInfoCompanyWarrant> {}
export const InstrumentSummaryInfoCompanyWarrant = props({
  AssetType: AssetType.extract(['CompanyWarrant']),
  CurrencyCode: Currency3,
  Description: string(),
  ExchangeId: string(),
  GroupId: integer(),
  Identifier: integer(),
  IssuerCountry: CountryCodeA2,
  PrimaryListing: optional(integer()),
  SummaryType: SummaryType,
  Symbol: string(),
  TradableAs: array(AssetType.extract(['CompanyWarrant'])),
})

export interface InstrumentSummaryInfoContractFutures extends GuardType<typeof InstrumentSummaryInfoContractFutures> {}
export const InstrumentSummaryInfoContractFutures = props({
  AssetType: AssetType.extract(['ContractFutures']),
  CurrencyCode: Currency3,
  Description: string(),
  ExchangeId: string(),
  GroupId: integer(),
  Identifier: integer(),
  PrimaryListing: integer(),
  SummaryType: SummaryType,
  Symbol: string(),
  TradableAs: optional(array(AssetType.extract(['ContractFutures']))),
})

export interface InstrumentSummaryInfoEtc extends GuardType<typeof InstrumentSummaryInfoEtc> {}
export const InstrumentSummaryInfoEtc = props({
  AssetType: AssetType.extract(['Etc']),
  CurrencyCode: Currency3,
  Description: string(),
  ExchangeId: string(),
  GroupId: integer(),
  Identifier: integer(),
  IssuerCountry: CountryCodeA2,
  PrimaryListing: optional(integer()),
  SummaryType: SummaryType,
  Symbol: string(),
  TradableAs: array(AssetType.extract(['Etc'])),
})

export interface InstrumentSummaryInfoEtf extends GuardType<typeof InstrumentSummaryInfoEtf> {}
export const InstrumentSummaryInfoEtf = props({
  AssetType: AssetType.extract(['Etf']),
  CurrencyCode: Currency3,
  Description: string(),
  ExchangeId: string(),
  GroupId: integer(),
  Identifier: integer(),
  IssuerCountry: CountryCodeA2,
  PrimaryListing: optional(integer()),
  SummaryType: SummaryType,
  Symbol: string(),
  TradableAs: array(AssetType.extract(['Etf'])),
})

export interface InstrumentSummaryInfoEtn extends GuardType<typeof InstrumentSummaryInfoEtn> {}
export const InstrumentSummaryInfoEtn = props({
  AssetType: AssetType.extract(['Etn']),
  CurrencyCode: Currency3,
  Description: string(),
  ExchangeId: string(),
  GroupId: integer(),
  Identifier: integer(),
  IssuerCountry: CountryCodeA2,
  PrimaryListing: optional(integer()),
  SummaryType: SummaryType,
  Symbol: string(),
  TradableAs: array(AssetType.extract(['Etn'])),
})

export interface InstrumentSummaryInfoFund extends GuardType<typeof InstrumentSummaryInfoFund> {}
export const InstrumentSummaryInfoFund = props({
  AssetType: AssetType.extract(['Fund']),
  CurrencyCode: Currency3,
  Description: string(),
  ExchangeId: string(),
  GroupId: integer(),
  Identifier: integer(),
  IssuerCountry: CountryCodeA2,
  PrimaryListing: optional(integer()),
  SummaryType: SummaryType,
  Symbol: string(),
  TradableAs: array(AssetType.extract(['Fund'])),
})

export interface InstrumentSummaryInfoFuturesOption extends GuardType<typeof InstrumentSummaryInfoFuturesOption> {}
export const InstrumentSummaryInfoFuturesOption = props({
  AssetType: AssetType.extract(['FuturesOption']),
  CanParticipateInMultiLegOrder: boolean(),
  CurrencyCode: Currency3,
  Description: string(),
  ExchangeId: string(),
  GroupId: integer(),
  GroupOptionRootId: integer(),
  Identifier: integer(),
  SummaryType: SummaryType,
  Symbol: string(),
})

export interface InstrumentSummaryInfoFuturesStrategy extends GuardType<typeof InstrumentSummaryInfoFuturesStrategy> {}
export const InstrumentSummaryInfoFuturesStrategy = props({
  AssetType: AssetType.extract(['FuturesStrategy']),
  CurrencyCode: Currency3,
  Description: string(),
  ExchangeId: string(),
  GroupId: integer(),
  Identifier: integer(),
  PrimaryListing: integer(),
  SummaryType: SummaryType,
  Symbol: string(),
  TradableAs: array(AssetType.extract(['FuturesStrategy'])),
})

export interface InstrumentSummaryInfoFxSpot extends GuardType<typeof InstrumentSummaryInfoFxSpot> {}
export const InstrumentSummaryInfoFxSpot = props({
  AssetType: AssetType.extract(['FxSpot']),
  CurrencyCode: Currency3,
  Description: string(),
  DisplayHint: optional(string()),
  ExchangeId: string(),
  GroupId: integer(),
  Identifier: integer(),
  SummaryType: SummaryType,
  Symbol: string(),
  TradableAs: array(AssetType.extract(['FxSpot', 'FxForwards', 'FxSwap', 'FxVanillaOption'])),
})

export interface InstrumentSummaryInfoFxVanillaOption extends GuardType<typeof InstrumentSummaryInfoFxVanillaOption> {}
export const InstrumentSummaryInfoFxVanillaOption = props({
  AssetType: AssetType.extract(['FxVanillaOption']),
  CanParticipateInMultiLegOrder: boolean(),
  CurrencyCode: Currency3,
  Description: string(),
  DisplayHint: optional(string()),
  ExchangeId: string(),
  GroupId: integer(),
  Identifier: integer(),
  SummaryType: SummaryType,
  Symbol: string(),
  TradableAs: array(AssetType.extract(['FxSpot', 'FxForwards', 'FxSwap', 'FxVanillaOption'])),
  UnderlyingAssetType: AssetType.extract(['FxSpot']),
  UnderlyingUic: integer(),
})

export interface InstrumentSummaryInfoMutualFund extends GuardType<typeof InstrumentSummaryInfoMutualFund> {}
export const InstrumentSummaryInfoMutualFund = props({
  AssetType: AssetType.extract(['MutualFund']),
  CurrencyCode: Currency3,
  Description: string(),
  ExchangeId: string(),
  GroupId: integer(),
  Identifier: integer(),
  IssuerCountry: CountryCodeA2,
  SummaryType: SummaryType,
  Symbol: string(),
  TradableAs: array(AssetType.extract(['MutualFund'])),
})

export interface InstrumentSummaryInfoRights extends GuardType<typeof InstrumentSummaryInfoRights> {}
export const InstrumentSummaryInfoRights = props({
  AssetType: AssetType.extract(['Rights']),
  CurrencyCode: Currency3,
  Description: string(),
  ExchangeId: string(),
  GroupId: integer(),
  Identifier: integer(),
  IssuerCountry: CountryCodeA2,
  PrimaryListing: integer(),
  SummaryType: SummaryType,
  Symbol: string(),
  TradableAs: array(AssetType.extract(['Rights'])),
})

export interface InstrumentSummaryInfoStock extends GuardType<typeof InstrumentSummaryInfoStock> {}
export const InstrumentSummaryInfoStock = props({
  AssetType: AssetType.extract(['Stock']),
  CurrencyCode: Currency3,
  Description: string(),
  ExchangeId: string(),
  GroupId: integer(),
  Identifier: integer(),
  IssuerCountry: CountryCodeA2,
  PrimaryListing: optional(integer()),
  SummaryType: SummaryType,
  Symbol: string(),
  TradableAs: array(AssetType.extract(['Stock'])),
})

export interface InstrumentSummaryInfoStockIndex extends GuardType<typeof InstrumentSummaryInfoStockIndex> {}
export const InstrumentSummaryInfoStockIndex = props({
  AssetType: AssetType.extract(['StockIndex']),
  CurrencyCode: Currency3,
  Description: string(),
  ExchangeId: string(),
  GroupId: integer(),
  Identifier: integer(),
  IssuerCountry: CountryCodeA2,
  SummaryType: SummaryType,
  Symbol: string(),
  TradableAs: array(AssetType.extract(['StockIndex'])),
})

export interface InstrumentSummaryInfoStockIndexOption
  extends GuardType<typeof InstrumentSummaryInfoStockIndexOption> {}
export const InstrumentSummaryInfoStockIndexOption = props({
  AssetType: AssetType.extract(['StockIndexOption']),
  CanParticipateInMultiLegOrder: boolean(),
  CurrencyCode: Currency3,
  Description: string(),
  ExchangeId: string(),
  GroupId: integer(),
  GroupOptionRootId: integer(),
  Identifier: integer(),
  SummaryType: SummaryType,
  Symbol: string(),
})

export interface InstrumentSummaryInfoStockOption extends GuardType<typeof InstrumentSummaryInfoStockOption> {}
export const InstrumentSummaryInfoStockOption = props({
  AssetType: AssetType.extract(['StockOption']),
  CanParticipateInMultiLegOrder: boolean(),
  CurrencyCode: Currency3,
  Description: string(),
  ExchangeId: string(),
  GroupId: integer(),
  GroupOptionRootId: integer(),
  Identifier: integer(),
  SummaryType: SummaryType,
  Symbol: string(),
})

export interface InstrumentSummaryInfoFxNoTouchOption extends GuardType<typeof InstrumentSummaryInfoFxNoTouchOption> {}
export const InstrumentSummaryInfoFxNoTouchOption = props({
  AssetType: AssetType.extract(['FxNoTouchOption']),
  CurrencyCode: Currency3,
  Description: string(),
  ExchangeId: string(),
  GroupId: integer(),
  Identifier: integer(),
  SummaryType: SummaryType,
  Symbol: string(),
  TradableAs: array(AssetType.extract(['FxSpot', 'FxForwards', 'FxSwap', 'FxVanillaOption'])),
  UnderlyingAssetType: AssetType.extract(['FxSpot']),
  UnderlyingUic: integer(),
})

export interface InstrumentSummaryInfoFxOneTouchOption
  extends GuardType<typeof InstrumentSummaryInfoFxOneTouchOption> {}
export const InstrumentSummaryInfoFxOneTouchOption = props({
  AssetType: AssetType.extract(['FxOneTouchOption']),
  CurrencyCode: Currency3,
  Description: string(),
  ExchangeId: string(),
  GroupId: integer(),
  Identifier: integer(),
  SummaryType: SummaryType,
  Symbol: string(),
  TradableAs: array(AssetType.extract(['FxSpot', 'FxForwards', 'FxSwap', 'FxVanillaOption'])),
  UnderlyingAssetType: AssetType.extract(['FxSpot']),
  UnderlyingUic: integer(),
})

export interface InstrumentSummaryInfoFxForwards extends GuardType<typeof InstrumentSummaryInfoFxForwards> {}
export const InstrumentSummaryInfoFxForwards = props({
  AssetType: AssetType.extract(['FxForwards']),
  CurrencyCode: Currency3,
  Description: string(),
  DisplayHint: optional(string()),
  ExchangeId: string(),
  GroupId: integer(),
  Identifier: integer(),
  SummaryType: SummaryType,
  Symbol: string(),
  TradableAs: array(AssetType.extract(['FxSpot', 'FxForwards', 'FxSwap', 'FxVanillaOption'])),
  UnderlyingAssetType: AssetType.extract(['FxSpot']),
  UnderlyingUic: integer(),
})

export interface InstrumentSummaryInfoFxSwap extends GuardType<typeof InstrumentSummaryInfoFxSwap> {}
export const InstrumentSummaryInfoFxSwap = props({
  AssetType: AssetType.extract(['FxSwap']),
  CurrencyCode: Currency3,
  Description: string(),
  DisplayHint: optional(string()),
  ExchangeId: string(),
  GroupId: integer(),
  Identifier: integer(),
  SummaryType: SummaryType,
  Symbol: string(),
  TradableAs: array(AssetType.extract(['FxSpot', 'FxForwards', 'FxSwap', 'FxVanillaOption'])),
  UnderlyingAssetType: AssetType.extract(['FxSpot']),
  UnderlyingUic: integer(),
})
