import { enums, type GuardType } from 'https://raw.githubusercontent.com/systematic-trader/type-guard/main/mod.ts'

export type PlaceableOrderType = GuardType<typeof PlaceableOrderType>

export const PlaceableOrderType = enums([
  /** Algo order. */
  'Algorithmic',
  /** Deal Capture Order. Specify to capture trades, which are already registered on Exchange, into Saxo System. Currently supported for selected partners only. */
  'DealCapture',
  /** Order Type currently not supported. */
  'GuaranteedStop',
  /** Limit Order. */
  'Limit',
  /** Market Order. */
  'Market',
  /** Stop Order. */
  'Stop',
  /** Stop if traded. */
  'StopIfTraded',
  /** Stop Limit Order. */
  'StopLimit',
  /** Switch order, Sell X and Buy Y with one order. */
  'Switch',
  /** Trailing stop. */
  'TrailingStop',
  /** Trailing stop if traded. */
  'TrailingStopIfTraded',
  /** Traspaso. Specific type of switch order. Only available on select MutualFunds. */
  'Traspaso',
  /** TraspasoIn. Specific type of switch order */
  'TraspasoIn',
  /** Trigger breakout order. Specific type for trigger orders. */
  'TriggerBreakout',
  /** Trigger limit order. Specific type for trigger orders. */
  'TriggerLimit',
  /** Trigger stop order. Specific type for trigger orders. */
  'TriggerStop',
])
