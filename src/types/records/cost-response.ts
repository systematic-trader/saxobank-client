import {
  array,
  type GuardType,
  integer,
  literal,
  number,
  optional,
  props,
  string,
  union,
} from 'https://raw.githubusercontent.com/systematic-trader/type-guard/main/mod.ts'
import { Currency3 } from '../derives/currency.ts'
import { AssetType } from '../derives/asset-type.ts'
import { InstrumentDisplayAndFormat } from '../derives/instrument-display-and-format.ts'
import { LongShortCost } from '../derives/long-short-cost.ts'
import { PriceDisplayFormatType } from '../derives/price-display-format-type.ts'
import { CostAssumption } from '../derives/cost-assumption.ts'

export interface CostResponse extends GuardType<typeof CostResponse> {}

export const CostResponse = props({
  /** Currency of the selected account, used when listing currency conversion fees for the selected instrument back to the account currency. */
  AccountCurrency: Currency3,

  /** Unique ID of the account. */
  AccountID: string(),

  /** Number of instrument. */
  Amount: number(),

  /** Asset Type */
  AssetType: AssetType,

  /** Trade Cost for the instrument. */
  Cost: props({
    Long: LongShortCost,
    Short: LongShortCost,
  }),

  /** Calculation Assumptions */
  CostCalculationAssumptions: array(CostAssumption),

  /** Includes Symbol and formatting info. (standard object also used in most other service groups) */
  DisplayAndFormat: InstrumentDisplayAndFormat.merge({
    Format: optional(PriceDisplayFormatType),
    OrderDecimals: optional(integer()),
  }),

  /** Holding period in days. */
  HoldingPeriodInDays: integer(),

  /** Description of instrument. */
  Instrument: string(),

  /** Price of instrument. */
  Price: number(),

  /** Instrument UIC. */
  Uic: integer(),

  /** Not documented */
  InstrumentMarginRequirements: optional(
    array(
      union([
        props({
          MarginType: literal('Absolute'),
          ExtraWeek: number(),
          Initial: number(),
          IntraWeek: number(),
        }),

        props({
          MarginType: literal('Percentage'),
          ExtraWeek: number(),
          Initial: number(),
          IntraWeek: number(),
        }),
      ]),
    ),
  ),

  /** Not documented */
  MarginTierRequirement: optional(
    props({
      TierCurrency: Currency3,
      Entries: array(props({
        TierLowerBound: number(),
        IntraWeekMarginRate: number(),
        InitialMarginRate: number(),
        ExtraWeekMarginRate: number(),
      })),
    }),
  ),
})
