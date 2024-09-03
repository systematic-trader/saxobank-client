import {
  array,
  boolean,
  enums,
  format,
  type GuardType,
  props,
  string,
} from 'https://raw.githubusercontent.com/systematic-trader/type-guard/main/mod.ts'
import { AssetType } from '../derives/asset-type.ts'

export interface User extends GuardType<typeof User> {}

export const User = props({
  Active: boolean(),
  ClientKey: string(),
  Culture: enums(['da-DK']),
  Language: enums(['en']),
  LastLoginStatus: enums(['Successful']),
  LastLoginTime: format('date-iso8601'),
  LegalAssetTypes: array(AssetType),
  MarketDataViaOpenApiTermsAccepted: boolean(),
  Name: string(),
  TimeZoneId: enums([26]),
  UserId: string(),
  UserKey: string(),
})
