import {
  array,
  type GuardType,
  integer,
  props,
} from 'https://raw.githubusercontent.com/systematic-trader/type-guard/main/mod.ts'
import { ChartInfo } from '../derives/chart-info.ts'
import { ChartSample } from '../derives/chart-sample.ts'
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
