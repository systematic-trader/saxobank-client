import {
  type GuardType,
  integer,
  number,
  props,
} from 'https://raw.githubusercontent.com/systematic-trader/type-guard/main/mod.ts'
import { Currency3 } from './currency.ts'

export interface Greeks extends GuardType<typeof Greeks> {}

export const Greeks = props({
  /** Shows the equivalent FX Spot exposure of a given position. This is the sensitivity of a position’s value with respect to the spot rate. */
  Delta: number(),

  /** The currency of the Delta value. */
  DeltaCurrency: Currency3,

  /** The number of decimal places in the Delta value. Used for display purposes. */
  DeltaDisplayDecimals: integer(),

  /** This is the second derivative of the position value with respect to spot, i.e. it shows how much the delta changes when spot changes (i.e. how much will the delta change when spot moves up by one percentage point. */
  Gamma: number(),

  /** The currency of the Gamma value. */
  GammaCurrency: Currency3,

  /** The number of decimal places in the Gamma value. Used for display purposes. */
  GammaDisplayDecimals: integer(),

  /** Delta measures the degree to which an option is exposed to shifts in the price of the underlying instrument. A one-point change in the underlying instrument's price affects this option's value by the Delta amount. */
  InstrumentDelta: number(),

  /** Gamma measures the rate of change of an option's price with fluctuations in the price of the underlying instrument. A one-point change in the underlying instrument's price changes this option's Delta by the Gamma amount. */
  InstrumentGamma: number(),

  /** Theta measures the rate of decline in the value of an option due to the passage of time and is also known as 'time decay'. The value of the option changes by the Theta amount for each passing day. */
  InstrumentTheta: number(),

  /** InstrumentTheta of the instrument in account currency. */
  InstrumentThetaInAccountCurrency: number(),

  /** Vega measures the rate of change between an option's value and the underlying asset's implied volatility. A one percentage point increase in implied volatility shifts the option's bid/ask price by the Vega amount. */
  InstrumentVega: number(),

  /** The mid rate for the implied volatility used in pricing this option */
  MidVol: number(),

  /** InstrumentTheta of the position in account currency. */
  PositionThetaInAccountCurrency: number(),

  /** The theoretical price. */
  TheoreticalPrice: number(),

  /** Refers to the combined time decay of all the options in a particular trading position. I.e. the sum of the individual theta values for each option. */
  Theta: number(),

  /** The currency of the Theta value. */
  ThetaCurrency: Currency3,

  /** The number of decimal places in the Theta value. Used for display purposes. */
  ThetaDisplayDecimals: integer(),

  /** Sensitivity of a position with respect to the implied volatility used to price FX Options. This shows how much money is made (positive number) or lost (negative number) when volatility goes up by one percentage point. */
  Vega: number(),

  /** The currency of the Vega value. */
  VegaCurrency: Currency3,

  /** The number of decimal places in the Vega value. Used for display purposes. */
  VegaDisplayDecimals: integer(),
})
