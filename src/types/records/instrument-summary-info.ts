import {
  array,
  boolean,
  enums,
  type GuardType,
  integer,
  literal,
  optional,
  props,
  string,
} from 'https://raw.githubusercontent.com/systematic-trader/type-guard/main/mod.ts'
import { CountryCodeA2 } from '../derives/country.ts'
import { Currency3 } from '../derives/currency.ts'
import { SummaryType } from '../derives/summary-type.ts'

export type InstrumentSummaryInfoType =
  | InstrumentSummaryInfoBond
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

export const InstrumentSummaryInfoBond = props({
  AssetType: literal('Bond'),
  CurrencyCode: Currency3,
  Description: string(),
  ExchangeId: string(),
  GroupId: integer(),
  Identifier: integer(),
  IssuerCountry: CountryCodeA2,
  SummaryType: SummaryType,
  Symbol: string(),
  TradableAs: array(enums(['Bond'])),
  UnderlyingAssetType: optional(enums(['Stock'])),
  UnderlyingUic: optional(integer()),
})

export interface InstrumentSummaryInfoBond extends GuardType<typeof InstrumentSummaryInfoBond> {}

export const InstrumentSummaryInfoCfdOnCompanyWarrant = props({
  AssetType: literal('CfdOnCompanyWarrant'),
  CurrencyCode: Currency3,
  Description: string(),
  ExchangeId: string(),
  GroupId: integer(),
  Identifier: integer(),
  IssuerCountry: CountryCodeA2,
  PrimaryListing: optional(integer()),
  SummaryType: SummaryType,
  Symbol: string(),
  TradableAs: array(enums(['CfdOnCompanyWarrant'])),
})

export interface InstrumentSummaryInfoCfdOnCompanyWarrant
  extends GuardType<typeof InstrumentSummaryInfoCfdOnCompanyWarrant> {}

export const InstrumentSummaryInfoCfdOnEtc = props({
  AssetType: literal('CfdOnEtc'),
  CurrencyCode: Currency3,
  Description: string(),
  ExchangeId: string(),
  GroupId: integer(),
  Identifier: integer(),
  IssuerCountry: CountryCodeA2,
  PrimaryListing: optional(integer()),
  SummaryType: SummaryType,
  Symbol: string(),
  TradableAs: array(enums(['CfdOnEtc'])),
})

export interface InstrumentSummaryInfoCfdOnEtc extends GuardType<typeof InstrumentSummaryInfoCfdOnEtc> {}

export const InstrumentSummaryInfoCfdOnEtf = props({
  AssetType: literal('CfdOnEtf'),
  CurrencyCode: Currency3,
  Description: string(),
  ExchangeId: string(),
  GroupId: integer(),
  Identifier: integer(),
  IssuerCountry: CountryCodeA2,
  PrimaryListing: optional(integer()),
  SummaryType: SummaryType,
  Symbol: string(),
  TradableAs: array(enums(['CfdOnEtf'])),
})

export interface InstrumentSummaryInfoCfdOnEtf extends GuardType<typeof InstrumentSummaryInfoCfdOnEtf> {}

export const InstrumentSummaryInfoCfdOnEtn = props({
  AssetType: literal('CfdOnEtn'),
  CurrencyCode: Currency3,
  Description: string(),
  ExchangeId: string(),
  GroupId: integer(),
  Identifier: integer(),
  IssuerCountry: CountryCodeA2,
  SummaryType: SummaryType,
  Symbol: string(),
  TradableAs: array(enums(['CfdOnEtn'])),
})

export interface InstrumentSummaryInfoCfdOnEtn extends GuardType<typeof InstrumentSummaryInfoCfdOnEtn> {}

export const InstrumentSummaryInfoCfdOnFund = props({
  AssetType: literal('CfdOnFund'),
  CurrencyCode: Currency3,
  Description: string(),
  ExchangeId: string(),
  GroupId: integer(),
  Identifier: integer(),
  IssuerCountry: CountryCodeA2,
  PrimaryListing: optional(integer()),
  SummaryType: SummaryType,
  Symbol: string(),
  TradableAs: optional(array(enums(['CfdOnFund']))),
})

export interface InstrumentSummaryInfoCfdOnFund extends GuardType<typeof InstrumentSummaryInfoCfdOnFund> {}

export const InstrumentSummaryInfoCfdOnFutures = props({
  AssetType: literal('CfdOnFutures'),
  CurrencyCode: Currency3,
  Description: string(),
  ExchangeId: string(),
  GroupId: integer(),
  Identifier: integer(),
  PrimaryListing: integer(),
  SummaryType: SummaryType,
  Symbol: string(),
  TradableAs: array(enums(['CfdOnFutures'])),
  UnderlyingUic: integer(),
})

export interface InstrumentSummaryInfoCfdOnFutures extends GuardType<typeof InstrumentSummaryInfoCfdOnFutures> {}

export const InstrumentSummaryInfoCfdOnIndex = props({
  AssetType: literal('CfdOnIndex'),
  CurrencyCode: Currency3,
  Description: string(),
  ExchangeId: string(),
  GroupId: integer(),
  Identifier: integer(),
  SummaryType: SummaryType,
  Symbol: string(),
  TradableAs: array(enums(['CfdOnIndex'])),
  UnderlyingUic: integer(),
})

export interface InstrumentSummaryInfoCfdOnIndex extends GuardType<typeof InstrumentSummaryInfoCfdOnIndex> {}

export const InstrumentSummaryInfoCfdOnRights = props({
  AssetType: literal('CfdOnRights'),
  CurrencyCode: Currency3,
  Description: string(),
  ExchangeId: string(),
  GroupId: integer(),
  Identifier: integer(),
  IssuerCountry: CountryCodeA2,
  SummaryType: SummaryType,
  Symbol: string(),
  TradableAs: array(enums(['CfdOnRights'])),
})

export interface InstrumentSummaryInfoCfdOnRights extends GuardType<typeof InstrumentSummaryInfoCfdOnRights> {}

export const InstrumentSummaryInfoCfdOnStock = props({
  AssetType: literal('CfdOnStock'),
  CurrencyCode: Currency3,
  Description: string(),
  ExchangeId: string(),
  GroupId: integer(),
  Identifier: integer(),
  IssuerCountry: CountryCodeA2,
  PrimaryListing: optional(integer()),
  SummaryType: SummaryType,
  Symbol: string(),
  TradableAs: array(enums(['CfdOnStock'])),
})

export interface InstrumentSummaryInfoCfdOnStock extends GuardType<typeof InstrumentSummaryInfoCfdOnStock> {}

export const InstrumentSummaryInfoCompanyWarrant = props({
  AssetType: literal('CompanyWarrant'),
  CurrencyCode: Currency3,
  Description: string(),
  ExchangeId: string(),
  GroupId: integer(),
  Identifier: integer(),
  IssuerCountry: CountryCodeA2,
  PrimaryListing: optional(integer()),
  SummaryType: SummaryType,
  Symbol: string(),
  TradableAs: array(enums(['CompanyWarrant'])),
})

export interface InstrumentSummaryInfoCompanyWarrant extends GuardType<typeof InstrumentSummaryInfoCompanyWarrant> {}

export const InstrumentSummaryInfoContractFutures = props({
  AssetType: literal('ContractFutures'),
  CurrencyCode: Currency3,
  Description: string(),
  ExchangeId: string(),
  GroupId: integer(),
  Identifier: integer(),
  PrimaryListing: integer(),
  SummaryType: SummaryType,
  Symbol: string(),
  TradableAs: array(enums(['ContractFutures'])),
})

export interface InstrumentSummaryInfoContractFutures extends GuardType<typeof InstrumentSummaryInfoContractFutures> {}

export const InstrumentSummaryInfoEtc = props({
  AssetType: literal('Etc'),
  CurrencyCode: Currency3,
  Description: string(),
  ExchangeId: string(),
  GroupId: integer(),
  Identifier: integer(),
  IssuerCountry: CountryCodeA2,
  PrimaryListing: optional(integer()),
  SummaryType: SummaryType,
  Symbol: string(),
  TradableAs: array(enums(['Etc'])),
})

export interface InstrumentSummaryInfoEtc extends GuardType<typeof InstrumentSummaryInfoEtc> {}

export const InstrumentSummaryInfoEtf = props({
  AssetType: literal('Etf'),
  CurrencyCode: Currency3,
  Description: string(),
  ExchangeId: string(),
  GroupId: integer(),
  Identifier: integer(),
  IssuerCountry: CountryCodeA2,
  PrimaryListing: optional(integer()),
  SummaryType: SummaryType,
  Symbol: string(),
  TradableAs: array(enums(['Etf'])),
})

export interface InstrumentSummaryInfoEtf extends GuardType<typeof InstrumentSummaryInfoEtf> {}

export const InstrumentSummaryInfoEtn = props({
  AssetType: literal('Etn'),
  CurrencyCode: Currency3,
  Description: string(),
  ExchangeId: string(),
  GroupId: integer(),
  Identifier: integer(),
  IssuerCountry: CountryCodeA2,
  PrimaryListing: optional(integer()),
  SummaryType: SummaryType,
  Symbol: string(),
  TradableAs: array(enums(['Etn'])),
})

export interface InstrumentSummaryInfoEtn extends GuardType<typeof InstrumentSummaryInfoEtn> {}

export const InstrumentSummaryInfoFund = props({
  AssetType: literal('Fund'),
  CurrencyCode: Currency3,
  Description: string(),
  ExchangeId: string(),
  GroupId: integer(),
  Identifier: integer(),
  IssuerCountry: CountryCodeA2,
  PrimaryListing: optional(integer()),
  SummaryType: SummaryType,
  Symbol: string(),
  TradableAs: array(enums(['Fund'])),
})

export interface InstrumentSummaryInfoFund extends GuardType<typeof InstrumentSummaryInfoFund> {}

export const InstrumentSummaryInfoFuturesOption = props({
  AssetType: literal('FuturesOption'),
  Description: string(),
  ExchangeId: string(),
  GroupId: integer(),
  Identifier: integer(),
  SummaryType: SummaryType,
  Symbol: string(),
  CanParticipateInMultiLegOrder: boolean(),
  GroupOptionRootId: integer(),
})

export interface InstrumentSummaryInfoFuturesOption extends GuardType<typeof InstrumentSummaryInfoFuturesOption> {}

export const InstrumentSummaryInfoFuturesStrategy = props({
  AssetType: literal('FuturesStrategy'),
  CurrencyCode: Currency3,
  Description: string(),
  ExchangeId: string(),
  GroupId: integer(),
  Identifier: integer(),
  PrimaryListing: integer(),
  SummaryType: SummaryType,
  Symbol: string(),
  TradableAs: array(enums(['FuturesStrategy'])),
})

export interface InstrumentSummaryInfoFuturesStrategy extends GuardType<typeof InstrumentSummaryInfoFuturesStrategy> {}

export const InstrumentSummaryInfoFxSpot = props({
  AssetType: literal('FxSpot'),
  CurrencyCode: Currency3,
  Description: string(),
  DisplayHint: optional(string()),
  ExchangeId: string(),
  GroupId: integer(),
  Identifier: integer(),
  SummaryType: SummaryType,
  Symbol: string(),
  TradableAs: array(enums(['FxSpot', 'FxForwards', 'FxSwap'])),
})

export interface InstrumentSummaryInfoFxSpot extends GuardType<typeof InstrumentSummaryInfoFxSpot> {}

export const InstrumentSummaryInfoFxVanillaOption = props({
  AssetType: literal('FxVanillaOption'),
  CurrencyCode: Currency3,
  Description: string(),
  DisplayHint: optional(string()),
  ExchangeId: string(),
  GroupId: integer(),
  Identifier: integer(),
  SummaryType: SummaryType,
  Symbol: string(),
  TradableAs: array(enums(['FxSpot', 'FxForwards', 'FxSwap'])),
  CanParticipateInMultiLegOrder: boolean(),
  UnderlyingAssetType: enums(['FxSpot']),
  UnderlyingUic: integer(),
})

export interface InstrumentSummaryInfoFxVanillaOption extends GuardType<typeof InstrumentSummaryInfoFxVanillaOption> {}

export const InstrumentSummaryInfoMutualFund = props({
  AssetType: literal('MutualFund'),
  CurrencyCode: Currency3,
  Description: string(),
  ExchangeId: string(),
  GroupId: integer(),
  Identifier: integer(),
  IssuerCountry: CountryCodeA2,
  SummaryType: SummaryType,
  Symbol: string(),
  TradableAs: array(enums(['MutualFund'])),
})

export interface InstrumentSummaryInfoMutualFund extends GuardType<typeof InstrumentSummaryInfoMutualFund> {}

export const InstrumentSummaryInfoRights = props({
  AssetType: literal('Rights'),
  CurrencyCode: Currency3,
  Description: string(),
  ExchangeId: string(),
  GroupId: integer(),
  Identifier: integer(),
  IssuerCountry: CountryCodeA2,
  PrimaryListing: integer(),
  SummaryType: SummaryType,
  Symbol: string(),
  TradableAs: array(enums(['Rights'])),
})

export interface InstrumentSummaryInfoRights extends GuardType<typeof InstrumentSummaryInfoRights> {}

export const InstrumentSummaryInfoStock = props({
  AssetType: literal('Stock'),
  CurrencyCode: Currency3,
  Description: string(),
  ExchangeId: string(),
  GroupId: integer(),
  Identifier: integer(),
  IssuerCountry: CountryCodeA2,
  PrimaryListing: optional(integer()),
  SummaryType: SummaryType,
  Symbol: string(),
  TradableAs: array(enums(['Stock'])),
})

export interface InstrumentSummaryInfoStock extends GuardType<typeof InstrumentSummaryInfoStock> {}

export const InstrumentSummaryInfoStockIndex = props({
  AssetType: literal('StockIndex'),
  CurrencyCode: Currency3,
  Description: string(),
  ExchangeId: string(),
  GroupId: integer(),
  Identifier: integer(),
  IssuerCountry: CountryCodeA2,
  SummaryType: SummaryType,
  Symbol: string(),
  TradableAs: array(enums(['StockIndex'])),
})

export interface InstrumentSummaryInfoStockIndex extends GuardType<typeof InstrumentSummaryInfoStockIndex> {}

export const InstrumentSummaryInfoStockIndexOption = props({
  AssetType: literal('StockIndexOption'),
  Description: string(),
  ExchangeId: string(),
  GroupId: integer(),
  Identifier: integer(),
  SummaryType: SummaryType,
  Symbol: string(),
  CanParticipateInMultiLegOrder: boolean(),
  GroupOptionRootId: integer(),
})

export interface InstrumentSummaryInfoStockIndexOption
  extends GuardType<typeof InstrumentSummaryInfoStockIndexOption> {}

export const InstrumentSummaryInfoStockOption = props({
  AssetType: literal('StockOption'),
  Description: string(),
  ExchangeId: string(),
  GroupId: integer(),
  Identifier: integer(),
  SummaryType: SummaryType,
  Symbol: string(),
  CanParticipateInMultiLegOrder: boolean(),
  GroupOptionRootId: integer(),
})

export interface InstrumentSummaryInfoStockOption extends GuardType<typeof InstrumentSummaryInfoStockOption> {}

export const InstrumentSummaryInfoFxNoTouchOption = props({
  AssetType: literal('FxNoTouchOption'),
  CurrencyCode: Currency3,
  Description: string(),
  ExchangeId: string(),
  GroupId: integer(),
  Identifier: integer(),
  SummaryType: SummaryType,
  Symbol: string(),
  TradableAs: array(enums(['FxSpot', 'FxForwards', 'FxSwap'])),
  UnderlyingAssetType: enums(['FxSpot']),
  UnderlyingUic: integer(),
})

export interface InstrumentSummaryInfoFxNoTouchOption extends GuardType<typeof InstrumentSummaryInfoFxNoTouchOption> {}

export const InstrumentSummaryInfoFxOneTouchOption = props({
  AssetType: literal('FxOneTouchOption'),
  CurrencyCode: Currency3,
  Description: string(),
  ExchangeId: string(),
  GroupId: integer(),
  Identifier: integer(),
  SummaryType: SummaryType,
  Symbol: string(),
  TradableAs: array(enums(['FxSpot', 'FxForwards', 'FxSwap'])),
  UnderlyingAssetType: enums(['FxSpot']),
  UnderlyingUic: integer(),
})

export interface InstrumentSummaryInfoFxOneTouchOption
  extends GuardType<typeof InstrumentSummaryInfoFxOneTouchOption> {}

export const InstrumentSummaryInfoFxForwards = props({
  AssetType: literal('FxForwards'),
  CurrencyCode: Currency3,
  Description: string(),
  DisplayHint: optional(string()),
  ExchangeId: string(),
  GroupId: integer(),
  Identifier: integer(),
  SummaryType: SummaryType,
  Symbol: string(),
  TradableAs: array(enums(['FxSpot', 'FxForwards', 'FxSwap'])),
  UnderlyingAssetType: enums(['FxSpot']),
  UnderlyingUic: integer(),
})

export interface InstrumentSummaryInfoFxForwards extends GuardType<typeof InstrumentSummaryInfoFxForwards> {}

export const InstrumentSummaryInfoFxSwap = props({
  AssetType: literal('FxSwap'),
  CurrencyCode: Currency3,
  Description: string(),
  DisplayHint: optional(string()),
  ExchangeId: string(),
  GroupId: integer(),
  Identifier: integer(),
  SummaryType: SummaryType,
  Symbol: string(),
  TradableAs: array(enums(['FxSpot', 'FxForwards', 'FxSwap'])),
  UnderlyingAssetType: enums(['FxSpot']),
  UnderlyingUic: integer(),
})

export interface InstrumentSummaryInfoFxSwap extends GuardType<typeof InstrumentSummaryInfoFxSwap> {}
