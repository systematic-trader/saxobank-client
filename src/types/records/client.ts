import {
  array,
  boolean,
  enums,
  format,
  type GuardType,
  integer,
  number,
  props,
  string,
} from 'https://raw.githubusercontent.com/systematic-trader/type-guard/main/mod.ts'
import { AssetType } from '../derives/asset-type.ts'
import { Currency3 } from '../derives/currency.ts'
import { PositionNettingProfile } from '../derives/position-netting-profile.ts'

export interface Client extends GuardType<typeof Client> {}

export const Client = props({
  AccountValueProtectionLimit: number(),
  AllowedNettingProfiles: array(PositionNettingProfile),
  AllowedTradingSessions: enums(['Regular']),
  ClientId: format('positive-integer'),
  ClientKey: string(),
  ClientType: enums(['Normal']),
  ContractOptionsTradingProfile: enums(['Expert']),
  CurrencyDecimals: integer(),
  DefaultAccountId: format('positive-integer'),
  DefaultAccountKey: string(),
  DefaultCurrency: Currency3,
  ForceOpenDefaultValue: boolean(),
  IsMarginTradingAllowed: boolean(),
  IsVariationMarginEligible: boolean(),
  LegalAssetTypes: array(AssetType),
  LegalAssetTypesAreIndicative: boolean(),
  MarginCalculationMethod: enums(['Default']),
  MarginMonitoringMode: enums(['Margin']),
  Name: string(),
  PartnerPlatformId: format('positive-integer'),
  PositionNettingMethod: enums(['FIFO']),
  PositionNettingMode: enums(['EndOfDay']),
  PositionNettingProfile: PositionNettingProfile,
  ReduceExposureOnly: boolean(),
  SupportsAccountValueProtectionLimit: boolean(),
})
