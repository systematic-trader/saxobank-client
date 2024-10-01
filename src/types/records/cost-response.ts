import {
  array,
  enums,
  type GuardType,
  integer,
  literal,
  number,
  optional,
  props,
  record,
  string,
  union,
} from 'https://raw.githubusercontent.com/systematic-trader/type-guard/main/mod.ts'
import { AssetType } from '../derives/asset-type.ts'
import { BuySell } from '../derives/buy-sell.ts'
import { CostAssumption } from '../derives/cost-assumption.ts'
import { Currency3 } from '../derives/currency.ts'
import { InstrumentDisplayAndFormat } from '../derives/instrument-display-and-format.ts'
import { LongShortCost } from '../derives/long-short-cost.ts'
import { PriceDisplayFormatType } from '../derives/price-display-format-type.ts'

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

export const CostResponseBond = CostResponse.merge({
  Cost: props({
    Long: LongShortCost,
  }),
})

export interface CostResponseBond extends GuardType<typeof CostResponseBond> {}

export const CostResponseCfdOnCompanyWarrant = CostResponse.merge({
  Cost: props({
    Long: LongShortCost,
  }),
})

export interface CostResponseCfdOnCompanyWarrant extends GuardType<typeof CostResponseCfdOnCompanyWarrant> {}

export const CostResponseCfdOnEtc = CostResponse.merge({
  Cost: props({
    Long: LongShortCost,
    Short: optional(LongShortCost),
  }),
})

export interface CostResponseCfdOnEtc extends GuardType<typeof CostResponseCfdOnEtc> {}

export const CostResponseCfdOnEtf = CostResponse.merge({
  Cost: props({
    Long: LongShortCost,
    Short: optional(LongShortCost),
  }),
})

export interface CostResponseCfdOnEtf extends GuardType<typeof CostResponseCfdOnEtf> {}

export const CostResponseCfdOnEtn = CostResponse.merge({
  Cost: props({
    Long: LongShortCost,
  }),
})

export interface CostResponseCfdOnEtn extends GuardType<typeof CostResponseCfdOnEtn> {}

export const CostResponseCfdOnFund = CostResponse.merge({
  Cost: props({
    Long: LongShortCost,
    Short: optional(LongShortCost),
  }),
})

export interface CostResponseCfdOnFund extends GuardType<typeof CostResponseCfdOnFund> {}

export const CostResponseCfdOnFutures = CostResponse

export interface CostResponseCfdOnFutures extends GuardType<typeof CostResponseCfdOnFutures> {}

export const CostResponseCfdOnIndex = CostResponse

export interface CostResponseCfdOnIndex extends GuardType<typeof CostResponseCfdOnIndex> {}

export const CostResponseCfdOnRights = CostResponse.merge({
  Cost: props({
    Long: LongShortCost,
  }),
})

export interface CostResponseCfdOnRights extends GuardType<typeof CostResponseCfdOnRights> {}

export const CostResponseCfdOnStock = CostResponse.merge({
  Cost: props({
    Long: LongShortCost,
    Short: optional(LongShortCost),
  }),
})

export interface CostResponseCfdOnStock extends GuardType<typeof CostResponseCfdOnStock> {}

export const CostResponseCompanyWarrant = CostResponse.merge({
  Cost: props({
    Long: LongShortCost,
  }),
})

export interface CostResponseCompanyWarrant extends GuardType<typeof CostResponseCompanyWarrant> {}

export const CostResponseContractFutures = CostResponse

export interface CostResponseContractFutures extends GuardType<typeof CostResponseContractFutures> {}

export const CostResponseEtc = CostResponse.merge({
  Cost: props({
    Long: LongShortCost,
  }),
})

export interface CostResponseEtc extends GuardType<typeof CostResponseEtc> {}

export const CostResponseEtf = CostResponse.merge({
  Cost: props({
    Long: LongShortCost,
  }),
})

export interface CostResponseEtf extends GuardType<typeof CostResponseEtf> {}

export const CostResponseEtn = CostResponse.merge({
  Cost: props({
    Long: LongShortCost,
  }),
})

export interface CostResponseEtn extends GuardType<typeof CostResponseEtn> {}

export const CostResponseFund = CostResponse.merge({
  Cost: props({
    Long: LongShortCost,
  }),
})

export interface CostResponseFund extends GuardType<typeof CostResponseFund> {}

export const CostResponseFuturesOption = CostResponse

export interface CostResponseFuturesOption extends GuardType<typeof CostResponseFuturesOption> {}

export const CostResponseFxForwards = CostResponse

export interface CostResponseFxForwards extends GuardType<typeof CostResponseFxForwards> {}

export const CostResponseFxNoTouchOption = CostResponse.merge({
  Cost: record(
    enums(['Long', 'Short']),
    props({
      BuySell,
      Currency: Currency3,
      TotalCost: literal(0),
    }),
  ),
})

export interface CostResponseFxNoTouchOption extends GuardType<typeof CostResponseFxNoTouchOption> {}

export const CostResponseFxOneTouchOption = CostResponse.merge({
  Cost: record(
    enums(['Long', 'Short']),
    props({
      BuySell,
      Currency: Currency3,
      TotalCost: literal(0),
    }),
  ),
})

export interface CostResponseFxOneTouchOption extends GuardType<typeof CostResponseFxOneTouchOption> {}

export const CostResponseFxSpot = CostResponse

export interface CostResponseFxSpot extends GuardType<typeof CostResponseFxSpot> {}

export const CostResponseFxSwap = CostResponse.merge({
  Cost: record(
    enums(['Long', 'Short']),
    LongShortCost.omit(['TotalCostPct']),
  ),
})

export interface CostResponseFxSwap extends GuardType<typeof CostResponseFxSwap> {}

export const CostResponseFxVanillaOption = CostResponse.merge({
  Cost: record(
    enums(['Long', 'Short']),
    LongShortCost.omit(['TotalCostPct']),
  ),
})

export interface CostResponseFxVanillaOption extends GuardType<typeof CostResponseFxVanillaOption> {}

export const CostResponseRights = CostResponse.merge({
  Cost: props({
    Long: LongShortCost,
  }),
})

export interface CostResponseRights extends GuardType<typeof CostResponseRights> {}

export const CostResponseStock = CostResponse.merge({
  Cost: props({
    Long: LongShortCost,
  }),
})

export interface CostResponseStock extends GuardType<typeof CostResponseStock> {}

export const CostResponseStockIndexOption = CostResponse

export interface CostResponseStockIndexOption extends GuardType<typeof CostResponseStockIndexOption> {}

export const CostResponseStockOption = CostResponse

export interface CostResponseStockOption extends GuardType<typeof CostResponseStockOption> {}
