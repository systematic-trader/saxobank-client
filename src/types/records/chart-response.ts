import {
  array,
  type GuardType,
  integer,
  optional,
  props,
} from 'https://raw.githubusercontent.com/systematic-trader/type-guard/main/mod.ts'
import { ChartInfo } from '../derives/chart-info.ts'
import { ChartSample, ChartSampleBidAskOHLC, ChartSampleOHLC } from '../derives/chart-sample.ts'
import { DisplayAndFormat } from '../derives/display-and-format.ts'

export interface ChartResponse extends GuardType<typeof ChartResponse> {}

export const ChartResponse = props({
  /** Object holding information about the OHLC samples such as the exchange id of the price source, when the first sample begins, the horizon in minutes and how long the samples are delayed by. */
  ChartInfo,

  /** Array holding the individual OHLC samples. For Forex Instruments both Bid and Ask values are returned. For other instruments the values are the last traded values. */
  Data: array(ChartSample),

  /** This field holds a version number of the data. */
  DataVersion: integer(),

  /** Object holding information relevant to displaying the instrument and formatting the samples for charting it. Currently holds the symbol of the instrument, how many decimals samples have, a description of the instrument and what currency it is traded in. */
  DisplayAndFormat,
})

export const ChartResponseBond = ChartResponse.merge({
  Data: optional(array(ChartSampleOHLC)),
})

export interface ChartResponseBond extends GuardType<typeof ChartResponseBond> {}

export const ChartResponseCompanyWarrant = ChartResponse.merge({
  Data: optional(array(ChartSampleOHLC)),
})

export interface ChartResponseCompanyWarrant extends GuardType<typeof ChartResponseCompanyWarrant> {}

export const ChartResponseCfdOnCompanyWarrant = ChartResponse.merge({
  Data: optional(array(ChartSampleOHLC)),
})

export interface ChartResponseCfdOnCompanyWarrant extends GuardType<typeof ChartResponseCfdOnCompanyWarrant> {}

export const ChartResponseContractFutures = ChartResponse.merge({
  Data: optional(array(ChartSampleOHLC)),
})

export interface ChartResponseContractFutures extends GuardType<typeof ChartResponseContractFutures> {}

export const ChartResponseCfdOnFutures = ChartResponse.merge({
  Data: optional(array(ChartSampleBidAskOHLC)),
})

export interface ChartResponseCfdOnFutures extends GuardType<typeof ChartResponseCfdOnFutures> {}

export const ChartResponseEtc = ChartResponse.merge({
  Data: optional(array(ChartSampleOHLC)),
})

export interface ChartResponseEtc extends GuardType<typeof ChartResponseEtc> {}

export const ChartResponseCfdOnEtc = ChartResponse.merge({
  Data: optional(array(ChartSampleOHLC)),
})

export interface ChartResponseCfdOnEtc extends GuardType<typeof ChartResponseCfdOnEtc> {}

export const ChartResponseEtf = ChartResponse.merge({
  Data: optional(array(ChartSampleOHLC)),
})

export interface ChartResponseEtf extends GuardType<typeof ChartResponseEtf> {}

export const ChartResponseCfdOnEtf = ChartResponse.merge({
  Data: optional(array(ChartSampleOHLC)),
})

export interface ChartResponseCfdOnEtf extends GuardType<typeof ChartResponseCfdOnEtf> {}

export const ChartResponseEtn = ChartResponse.merge({
  Data: optional(array(ChartSampleOHLC)),
})

export interface ChartResponseEtn extends GuardType<typeof ChartResponseEtn> {}

export const ChartResponseCfdOnEtn = ChartResponse.merge({
  Data: optional(array(ChartSampleOHLC)),
})

export interface ChartResponseCfdOnEtn extends GuardType<typeof ChartResponseCfdOnEtn> {}

export const ChartResponseFund = ChartResponse.merge({
  Data: optional(array(ChartSampleOHLC)),
})

export interface ChartResponseFund extends GuardType<typeof ChartResponseFund> {}

export const ChartResponseCfdOnFund = ChartResponse.merge({
  Data: optional(array(ChartSampleOHLC)),
})

export interface ChartResponseCfdOnFund extends GuardType<typeof ChartResponseCfdOnFund> {}

export const ChartResponseFxSpot = ChartResponse.merge({
  Data: optional(array(ChartSampleBidAskOHLC)),
})

export interface ChartResponseFxSpot extends GuardType<typeof ChartResponseFxSpot> {}

export const ChartResponseRights = ChartResponse.merge({
  Data: optional(array(ChartSampleOHLC)),
})

export interface ChartResponseRights extends GuardType<typeof ChartResponseRights> {}

export const ChartResponseCfdOnRights = ChartResponse.merge({
  Data: optional(array(ChartSampleOHLC)),
})

export interface ChartResponseCfdOnRights extends GuardType<typeof ChartResponseCfdOnRights> {}

export const ChartResponseStock = ChartResponse.merge({
  Data: optional(array(ChartSampleOHLC)),
})

export interface ChartResponseStock extends GuardType<typeof ChartResponseStock> {}

export const ChartResponseCfdOnStock = ChartResponse.merge({
  Data: optional(array(ChartSampleOHLC)),
})

export interface ChartResponseCfdOnStock extends GuardType<typeof ChartResponseCfdOnStock> {}

export const ChartResponseStockIndex = ChartResponse.merge({
  Data: optional(array(ChartSampleOHLC)),
})

export interface ChartResponseStockIndex extends GuardType<typeof ChartResponseStockIndex> {}

export const ChartResponseCfdOnIndex = ChartResponse.merge({
  Data: optional(array(ChartSampleBidAskOHLC)),
})

export interface ChartResponseCfdOnIndex extends GuardType<typeof ChartResponseCfdOnIndex> {}
