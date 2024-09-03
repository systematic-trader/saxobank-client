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
  union,
} from 'https://raw.githubusercontent.com/systematic-trader/type-guard/main/mod.ts'
import { CountryCodeA2 } from '../derives/country.ts'
import { Currency3 } from '../derives/currency.ts'
import { SummaryType } from '../derives/summary-type.ts'

export const BondInstrumentSummaryInfo = props({
  AssetType: literal('Bond'),
  CurrencyCode: Currency3,
  Description: string(),
  ExchangeId: string(),
  GroupId: integer(),
  Identifier: integer(),
  IssuerCountry: CountryCodeA2,
  PrimaryListing: optional(integer()),
  SummaryType: SummaryType,
  Symbol: string(),
  TradableAs: optional(array(enums(['Bond']))),
  UnderlyingAssetType: optional(enums(['Stock'])),
  UnderlyingUic: optional(integer()),
})

export interface BondInstrumentSummaryInfo extends GuardType<typeof BondInstrumentSummaryInfo> {}

export const CfdOnCompanyWarrantInstrumentSummaryInfo = props({
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
  TradableAs: optional(array(enums(['CfdOnCompanyWarrant']))),
})

export interface CfdOnCompanyWarrantInstrumentSummaryInfo
  extends GuardType<typeof CfdOnCompanyWarrantInstrumentSummaryInfo> {}

export const CfdOnEtcInstrumentSummaryInfo = props({
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
  TradableAs: optional(array(enums(['CfdOnEtc']))),
})

export interface CfdOnEtcInstrumentSummaryInfo extends GuardType<typeof CfdOnEtcInstrumentSummaryInfo> {}

export const CfdOnEtfInstrumentSummaryInfo = props({
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
  TradableAs: optional(array(enums(['CfdOnEtf']))),
})

export interface CfdOnEtfInstrumentSummaryInfo extends GuardType<typeof CfdOnEtfInstrumentSummaryInfo> {}

export const CfdOnEtnInstrumentSummaryInfo = props({
  AssetType: literal('CfdOnEtn'),
  CurrencyCode: Currency3,
  Description: string(),
  ExchangeId: string(),
  GroupId: integer(),
  Identifier: integer(),
  IssuerCountry: CountryCodeA2,
  PrimaryListing: optional(integer()),
  SummaryType: SummaryType,
  Symbol: string(),
  TradableAs: optional(array(enums(['CfdOnEtn']))),
})

export interface CfdOnEtnInstrumentSummaryInfo extends GuardType<typeof CfdOnEtnInstrumentSummaryInfo> {}

export const CfdOnFundInstrumentSummaryInfo = props({
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

export interface CfdOnFundInstrumentSummaryInfo extends GuardType<typeof CfdOnFundInstrumentSummaryInfo> {}

export const CfdOnFuturesInstrumentSummaryInfo = props({
  AssetType: literal('CfdOnFutures'),
  CurrencyCode: Currency3,
  Description: string(),
  ExchangeId: string(),
  GroupId: integer(),
  Identifier: integer(),
  IssuerCountry: CountryCodeA2,
  PrimaryListing: optional(integer()),
  SummaryType: SummaryType,
  Symbol: string(),
  TradableAs: optional(array(enums(['CfdOnFutures']))),
})

export interface CfdOnFuturesInstrumentSummaryInfo extends GuardType<typeof CfdOnFuturesInstrumentSummaryInfo> {}

export const CfdOnIndexInstrumentSummaryInfo = props({
  AssetType: literal('CfdOnIndex'),
  CurrencyCode: Currency3,
  Description: string(),
  ExchangeId: string(),
  GroupId: integer(),
  Identifier: integer(),
  // IssuerCountry: optional(CountryCodeA2),
  PrimaryListing: optional(integer()),
  SummaryType: SummaryType,
  Symbol: string(),
  TradableAs: optional(array(enums(['CfdOnIndex']))),
  UnderlyingUic: integer(),
})

export interface CfdOnIndexInstrumentSummaryInfo extends GuardType<typeof CfdOnIndexInstrumentSummaryInfo> {}

export const CfdOnRightsInstrumentSummaryInfo = props({
  AssetType: literal('CfdOnRights'),
  CurrencyCode: Currency3,
  Description: string(),
  ExchangeId: string(),
  GroupId: integer(),
  Identifier: integer(),
  IssuerCountry: CountryCodeA2,
  PrimaryListing: optional(integer()),
  SummaryType: SummaryType,
  Symbol: string(),
  TradableAs: optional(array(enums(['CfdOnRights']))),
})

export interface CfdOnRightsInstrumentSummaryInfo extends GuardType<typeof CfdOnRightsInstrumentSummaryInfo> {}

export const CfdOnStockInstrumentSummaryInfo = props({
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
  TradableAs: optional(array(enums(['CfdOnStock']))),
})

export interface CfdOnStockInstrumentSummaryInfo extends GuardType<typeof CfdOnStockInstrumentSummaryInfo> {}

export const CompanyWarrantInstrumentSummaryInfo = props({
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
  TradableAs: optional(array(enums(['CompanyWarrant']))),
})

export interface CompanyWarrantInstrumentSummaryInfo extends GuardType<typeof CompanyWarrantInstrumentSummaryInfo> {}

export const ContractFuturesInstrumentSummaryInfo = props({
  AssetType: literal('ContractFutures'),
  CurrencyCode: Currency3,
  Description: string(),
  ExchangeId: string(),
  GroupId: integer(),
  Identifier: integer(),
  IssuerCountry: CountryCodeA2,
  PrimaryListing: optional(integer()),
  SummaryType: SummaryType,
  Symbol: string(),
  TradableAs: optional(array(enums(['ContractFutures']))),
})

export interface ContractFuturesInstrumentSummaryInfo extends GuardType<typeof ContractFuturesInstrumentSummaryInfo> {}

export const EtcInstrumentSummaryInfo = props({
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
  TradableAs: optional(array(enums(['Etc']))),
})

export interface EtcInstrumentSummaryInfo extends GuardType<typeof EtcInstrumentSummaryInfo> {}

export const EtfInstrumentSummaryInfo = props({
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
  TradableAs: optional(array(enums(['Etf']))),
})

export interface EtfInstrumentSummaryInfo extends GuardType<typeof EtfInstrumentSummaryInfo> {}

export const EtnInstrumentSummaryInfo = props({
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
  TradableAs: optional(array(enums(['Etn']))),
})

export interface EtnInstrumentSummaryInfo extends GuardType<typeof EtnInstrumentSummaryInfo> {}

export const FundInstrumentSummaryInfo = props({
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
  TradableAs: optional(array(enums(['Fund']))),
})

export interface FundInstrumentSummaryInfo extends GuardType<typeof FundInstrumentSummaryInfo> {}

export const FuturesOptionInstrumentSummaryInfo = props({
  AssetType: literal('FuturesOption'),
  // CurrencyCode: optional(Currency3),
  Description: string(),
  ExchangeId: string(),
  GroupId: integer(),
  Identifier: integer(),
  // IssuerCountry: optional(CountryCodeA2),
  PrimaryListing: optional(integer()),
  SummaryType: SummaryType,
  Symbol: string(),
  TradableAs: optional(array(enums(['FuturesOption']))),
  CanParticipateInMultiLegOrder: boolean(),
  GroupOptionRootId: integer(),
})

export interface FuturesOptionInstrumentSummaryInfo extends GuardType<typeof FuturesOptionInstrumentSummaryInfo> {}

export const FuturesStrategyInstrumentSummaryInfo = props({
  AssetType: literal('FuturesStrategy'),
  CurrencyCode: Currency3,
  Description: string(),
  ExchangeId: string(),
  GroupId: integer(),
  Identifier: integer(),
  IssuerCountry: CountryCodeA2,
  PrimaryListing: optional(integer()),
  SummaryType: SummaryType,
  Symbol: string(),
  TradableAs: optional(array(enums(['FuturesStrategy']))),
})

export interface FuturesStrategyInstrumentSummaryInfo extends GuardType<typeof FuturesStrategyInstrumentSummaryInfo> {}

export const FxSpotInstrumentSummaryInfo = props({
  AssetType: literal('FxSpot'),
  CurrencyCode: Currency3,
  Description: string(),
  ExchangeId: string(),
  GroupId: integer(),
  Identifier: integer(),
  IssuerCountry: CountryCodeA2,
  PrimaryListing: optional(integer()),
  SummaryType: SummaryType,
  Symbol: string(),
  TradableAs: optional(array(enums(['FxSpot']))),
})

export interface FxSpotInstrumentSummaryInfo extends GuardType<typeof FxSpotInstrumentSummaryInfo> {}

export const FxVanillaOptionInstrumentSummaryInfo = props({
  AssetType: literal('FxVanillaOption'),
  CurrencyCode: Currency3,
  Description: string(),
  ExchangeId: string(),
  GroupId: integer(),
  Identifier: integer(),
  IssuerCountry: CountryCodeA2,
  PrimaryListing: optional(integer()),
  SummaryType: SummaryType,
  Symbol: string(),
  TradableAs: optional(array(enums(['FxVanillaOption']))),
})

export interface FxVanillaOptionInstrumentSummaryInfo extends GuardType<typeof FxVanillaOptionInstrumentSummaryInfo> {}

export const MutualFundInstrumentSummaryInfo = props({
  AssetType: literal('MutualFund'),
  CurrencyCode: Currency3,
  Description: string(),
  ExchangeId: string(),
  GroupId: integer(),
  Identifier: integer(),
  IssuerCountry: CountryCodeA2,
  PrimaryListing: optional(integer()),
  SummaryType: SummaryType,
  Symbol: string(),
  TradableAs: optional(array(enums(['MutualFund']))),
})

export interface MutualFundInstrumentSummaryInfo extends GuardType<typeof MutualFundInstrumentSummaryInfo> {}

export const RightsInstrumentSummaryInfo = props({
  AssetType: literal('Rights'),
  CurrencyCode: Currency3,
  Description: string(),
  ExchangeId: string(),
  GroupId: integer(),
  Identifier: integer(),
  IssuerCountry: CountryCodeA2,
  PrimaryListing: optional(integer()),
  SummaryType: SummaryType,
  Symbol: string(),
  TradableAs: optional(array(enums(['Rights']))),
})

export interface RightsInstrumentSummaryInfo extends GuardType<typeof RightsInstrumentSummaryInfo> {}

export const StockInstrumentSummaryInfo = props({
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
  TradableAs: optional(array(enums(['Stock']))),
})

export interface StockInstrumentSummaryInfo extends GuardType<typeof StockInstrumentSummaryInfo> {}

export const StockIndexInstrumentSummaryInfo = props({
  AssetType: literal('StockIndex'),
  CurrencyCode: Currency3,
  Description: string(),
  ExchangeId: string(),
  GroupId: integer(),
  Identifier: integer(),
  IssuerCountry: CountryCodeA2,
  PrimaryListing: optional(integer()),
  SummaryType: SummaryType,
  Symbol: string(),
  TradableAs: optional(array(enums(['StockIndex']))),
})

export interface StockIndexInstrumentSummaryInfo extends GuardType<typeof StockIndexInstrumentSummaryInfo> {}

export const StockIndexOptionInstrumentSummaryInfo = props({
  AssetType: literal('StockIndexOption'),
  // CurrencyCode: optional(Currency3),
  Description: string(),
  ExchangeId: string(),
  GroupId: integer(),
  Identifier: integer(),
  // IssuerCountry: optional(CountryCodeA2),
  PrimaryListing: optional(integer()),
  SummaryType: SummaryType,
  Symbol: string(),
  TradableAs: optional(array(enums(['StockIndexOption']))),
  CanParticipateInMultiLegOrder: boolean(),
  GroupOptionRootId: integer(),
})

export interface StockIndexOptionInstrumentSummaryInfo
  extends GuardType<typeof StockIndexOptionInstrumentSummaryInfo> {}

export const StockOptionInstrumentSummaryInfo = props({
  AssetType: literal('StockOption'),
  // CurrencyCode: optional(Currency3),
  Description: string(),
  ExchangeId: string(),
  GroupId: integer(),
  Identifier: integer(),
  // IssuerCountry: optional(CountryCodeA2),
  PrimaryListing: optional(integer()),
  SummaryType: SummaryType,
  Symbol: string(),
  TradableAs: optional(array(enums(['StockOption']))),
  CanParticipateInMultiLegOrder: boolean(),
  GroupOptionRootId: integer(),
})

export interface StockOptionInstrumentSummaryInfo extends GuardType<typeof StockOptionInstrumentSummaryInfo> {}

export const InstrumentSummaryInfo = union([
  BondInstrumentSummaryInfo,
  CfdOnCompanyWarrantInstrumentSummaryInfo,
  CfdOnEtcInstrumentSummaryInfo,
  CfdOnEtfInstrumentSummaryInfo,
  CfdOnEtnInstrumentSummaryInfo,
  CfdOnFundInstrumentSummaryInfo,
  CfdOnFuturesInstrumentSummaryInfo,
  CfdOnIndexInstrumentSummaryInfo,
  CfdOnRightsInstrumentSummaryInfo,
  CfdOnStockInstrumentSummaryInfo,
  CompanyWarrantInstrumentSummaryInfo,
  ContractFuturesInstrumentSummaryInfo,
  EtcInstrumentSummaryInfo,
  EtfInstrumentSummaryInfo,
  EtnInstrumentSummaryInfo,
  FundInstrumentSummaryInfo,
  FuturesOptionInstrumentSummaryInfo,
  FuturesStrategyInstrumentSummaryInfo,
  FxSpotInstrumentSummaryInfo,
  FxVanillaOptionInstrumentSummaryInfo,
  MutualFundInstrumentSummaryInfo,
  RightsInstrumentSummaryInfo,
  StockIndexOptionInstrumentSummaryInfo,
  StockIndexInstrumentSummaryInfo,
  StockOptionInstrumentSummaryInfo,
  StockInstrumentSummaryInfo,
])

export type InstrumentSummaryInfo =
  | BondInstrumentSummaryInfo
  | CfdOnCompanyWarrantInstrumentSummaryInfo
  | CfdOnEtcInstrumentSummaryInfo
  | CfdOnEtfInstrumentSummaryInfo
  | CfdOnEtnInstrumentSummaryInfo
  | CfdOnFundInstrumentSummaryInfo
  | CfdOnFuturesInstrumentSummaryInfo
  | CfdOnIndexInstrumentSummaryInfo
  | CfdOnRightsInstrumentSummaryInfo
  | CfdOnStockInstrumentSummaryInfo
  | CompanyWarrantInstrumentSummaryInfo
  | ContractFuturesInstrumentSummaryInfo
  | EtcInstrumentSummaryInfo
  | EtfInstrumentSummaryInfo
  | EtnInstrumentSummaryInfo
  | FundInstrumentSummaryInfo
  | FuturesOptionInstrumentSummaryInfo
  | FuturesStrategyInstrumentSummaryInfo
  | FxSpotInstrumentSummaryInfo
  | FxVanillaOptionInstrumentSummaryInfo
  | MutualFundInstrumentSummaryInfo
  | RightsInstrumentSummaryInfo
  | StockIndexOptionInstrumentSummaryInfo
  | StockIndexInstrumentSummaryInfo
  | StockOptionInstrumentSummaryInfo
  | StockInstrumentSummaryInfo
