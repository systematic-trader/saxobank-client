import {
  assertReturn,
  enums,
  type GuardType,
  integer,
  literal,
  number,
  optional,
  props,
  record,
  string,
} from 'https://raw.githubusercontent.com/systematic-trader/type-guard/main/mod.ts'

import type { TradingConditionFieldGroup } from '../../../types/derives/trading-condition-field-group.ts'
import type { ResourceClient } from '../../../resource-client.ts'
import { extractKeys } from '../../utils.ts'
import { CostResponse } from '../../../types/records/cost-response.ts'
import { LongShortCost } from '../../../types/derives/long-short-cost.ts'
import { BuySell } from '../../../types/derives/buy-sell.ts'
import { Currency3 } from '../../../types/derives/currency.ts'

const CostResponseLongOnly = CostResponse.merge({
  Cost: props({
    Long: LongShortCost,
  }),
})

const CostResponseOptionalShort = CostResponse.merge({
  Cost: props({
    Long: LongShortCost,
    Short: optional(LongShortCost),
  }),
})

const CostResponseEmptyLongShort = CostResponse.merge({
  Cost: record(
    enums(['Long', 'Short']),
    props({
      BuySell,
      Currency: Currency3,
      TotalCost: literal(0),
    }),
  ),
})

const CostResponseWithoutTotalPctCost = CostResponse.merge({
  Cost: record(
    enums(['Long', 'Short']),
    LongShortCost.omit(['TotalCostPct']),
  ),
})

const AssetTypeMap = {
  Bond: CostResponseLongOnly,

  CfdOnIndex: CostResponse,

  CompanyWarrant: CostResponseLongOnly,
  CfdOnCompanyWarrant: CostResponseLongOnly,

  CfdOnStock: CostResponse,
  Stock: CostResponseLongOnly,

  StockIndexOption: CostResponse,

  StockOption: CostResponse,

  ContractFutures: CostResponse,
  CfdOnFutures: CostResponse,

  Etc: CostResponseLongOnly,
  CfdOnEtc: CostResponseLongOnly,

  Etf: CostResponseLongOnly,
  CfdOnEtf: CostResponse,

  Etn: CostResponseLongOnly,
  CfdOnEtn: CostResponseLongOnly,

  CfdOnFund: CostResponseOptionalShort,
  Fund: CostResponseLongOnly,

  FuturesOption: CostResponse,

  FxForwards: CostResponse,
  FxNoTouchOption: CostResponseEmptyLongShort,
  FxOneTouchOption: CostResponseEmptyLongShort,
  FxSpot: CostResponse,
  FxSwap: CostResponseWithoutTotalPctCost,
  FxVanillaOption: CostResponseWithoutTotalPctCost,

  Rights: CostResponseLongOnly,
  CfdOnRights: CostResponseLongOnly,
} as const

type CostResponseByAssetType<T extends keyof typeof AssetTypeMap> = GuardType<typeof AssetTypeMap[T]>

const CostParametersGuard = props({
  AccountKey: string(),
  AssetType: enums(extractKeys(AssetTypeMap)),
  Amount: number(),
  HoldingPeriodInDays: optional(integer()),
  Price: number(),
  Uic: integer(),
})

export interface CostParameters extends GuardType<typeof CostParametersGuard> {}

export class Cost {
  readonly #client: ResourceClient

  constructor({ client }: { readonly client: ResourceClient }) {
    this.#client = client.appendPath('cost')
  }

  async get<AssetType extends keyof typeof AssetTypeMap>(
    parameters: {
      /** The account key to lookup the conditions for */
      readonly AccountKey: CostParameters['AccountKey']

      /** The number of asset to be traded. */
      readonly Amount: CostParameters['Amount']

      /** The assetType of the instrument to lookup */
      readonly AssetType: AssetType

      /** The holding period in days if provided else 1 day. */
      readonly HoldingPeriodInDays?: CostParameters['HoldingPeriodInDays']

      /**
       * The instrument price to be used for the calculation.
       * Required for all non-Saxo applications.
       */
      readonly Price: CostParameters['Price']

      /** The uic for the instrument to lookup */
      readonly Uic: CostParameters['Uic']
    },
  ): Promise<CostResponseByAssetType<AssetType>> {
    const { AccountKey, Amount, HoldingPeriodInDays, Price, Uic } = assertReturn(CostParametersGuard, parameters)

    const FieldGroups: readonly TradingConditionFieldGroup[] = ['DisplayAndFormat']

    return await this.#client.get<unknown>({
      path: [AccountKey, Uic, parameters.AssetType].join('/'),
      searchParams: {
        Amount,
        FieldGroups,
        HoldingPeriodInDays,
        Price,
      },
      guard: AssetTypeMap[parameters.AssetType],
    }) as unknown as Promise<CostResponseByAssetType<AssetType>>
  }
}
