import {
  assertReturn,
  enums,
  type GuardType,
  integer,
  number,
  optional,
  props,
  string,
} from 'https://raw.githubusercontent.com/systematic-trader/type-guard/main/mod.ts'

import type { ResourceClient } from '../../../resource-client.ts'
import type { TradingConditionFieldGroup } from '../../../types/derives/trading-condition-field-group.ts'
import {
  CostResponseBond,
  CostResponseCfdOnCompanyWarrant,
  CostResponseCfdOnEtc,
  CostResponseCfdOnEtf,
  CostResponseCfdOnEtn,
  CostResponseCfdOnFund,
  CostResponseCfdOnFutures,
  CostResponseCfdOnIndex,
  CostResponseCfdOnRights,
  CostResponseCfdOnStock,
  CostResponseCompanyWarrant,
  CostResponseContractFutures,
  CostResponseEtc,
  CostResponseEtf,
  CostResponseEtn,
  CostResponseFund,
  CostResponseFuturesOption,
  CostResponseFxForwards,
  CostResponseFxNoTouchOption,
  CostResponseFxOneTouchOption,
  CostResponseFxSpot,
  CostResponseFxSwap,
  CostResponseFxVanillaOption,
  CostResponseRights,
  CostResponseStock,
  CostResponseStockIndexOption,
  CostResponseStockOption,
} from '../../../types/records/cost-response.ts'
import { extractKeys } from '../../../utils.ts'

const CostResponse = {
  Bond: CostResponseBond,
  CfdOnCompanyWarrant: CostResponseCfdOnCompanyWarrant,
  CfdOnEtc: CostResponseCfdOnEtc,
  CfdOnEtf: CostResponseCfdOnEtf,
  CfdOnEtn: CostResponseCfdOnEtn,
  CfdOnFund: CostResponseCfdOnFund,
  CfdOnFutures: CostResponseCfdOnFutures,
  CfdOnIndex: CostResponseCfdOnIndex,
  CfdOnRights: CostResponseCfdOnRights,
  CfdOnStock: CostResponseCfdOnStock,
  CompanyWarrant: CostResponseCompanyWarrant,
  ContractFutures: CostResponseContractFutures,
  Etc: CostResponseEtc,
  Etf: CostResponseEtf,
  Etn: CostResponseEtn,
  Fund: CostResponseFund,
  FuturesOption: CostResponseFuturesOption,
  FxForwards: CostResponseFxForwards,
  FxNoTouchOption: CostResponseFxNoTouchOption,
  FxOneTouchOption: CostResponseFxOneTouchOption,
  FxSpot: CostResponseFxSpot,
  FxSwap: CostResponseFxSwap,
  FxVanillaOption: CostResponseFxVanillaOption,
  Rights: CostResponseRights,
  Stock: CostResponseStock,
  StockIndexOption: CostResponseStockIndexOption,
  StockOption: CostResponseStockOption,
} as const

type CostResponse = {
  Bond: CostResponseBond
  CfdOnCompanyWarrant: CostResponseCfdOnCompanyWarrant
  CfdOnEtc: CostResponseCfdOnEtc
  CfdOnEtf: CostResponseCfdOnEtf
  CfdOnEtn: CostResponseCfdOnEtn
  CfdOnFund: CostResponseCfdOnFund
  CfdOnFutures: CostResponseCfdOnFutures
  CfdOnIndex: CostResponseCfdOnIndex
  CfdOnRights: CostResponseCfdOnRights
  CfdOnStock: CostResponseCfdOnStock
  CompanyWarrant: CostResponseCompanyWarrant
  ContractFutures: CostResponseContractFutures
  Etc: CostResponseEtc
  Etf: CostResponseEtf
  Etn: CostResponseEtn
  Fund: CostResponseFund
  FuturesOption: CostResponseFuturesOption
  FxForwards: CostResponseFxForwards
  FxNoTouchOption: CostResponseFxNoTouchOption
  FxOneTouchOption: CostResponseFxOneTouchOption
  FxSpot: CostResponseFxSpot
  FxSwap: CostResponseFxSwap
  FxVanillaOption: CostResponseFxVanillaOption
  Rights: CostResponseRights
  Stock: CostResponseStock
  StockIndexOption: CostResponseStockIndexOption
  StockOption: CostResponseStockOption
}

const CostParametersGuard = props({
  AccountKey: string(),
  AssetType: enums(extractKeys(CostResponse)),
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

  async get<AssetType extends keyof CostResponse>(
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
  ): Promise<CostResponse[AssetType]>

  async get(
    parameters: CostParameters,
  ): Promise<CostResponse[keyof CostResponse]> {
    const { AccountKey, Amount, HoldingPeriodInDays, Price, Uic } = assertReturn(CostParametersGuard, parameters)

    const FieldGroups: readonly TradingConditionFieldGroup[] = ['DisplayAndFormat']

    const path = [AccountKey, Uic, parameters.AssetType].join('/')

    const searchParams = {
      Amount,
      FieldGroups,
      HoldingPeriodInDays,
      Price,
    }

    switch (parameters.AssetType) {
      case 'Bond': {
        return await this.#client.get({
          path,
          searchParams,
          guard: CostResponse[parameters.AssetType],
        })
      }

      case 'CfdOnCompanyWarrant': {
        return await this.#client.get({
          path,
          searchParams,
          guard: CostResponse[parameters.AssetType],
        })
      }

      case 'CfdOnEtc': {
        return await this.#client.get({
          path,
          searchParams,
          guard: CostResponse[parameters.AssetType],
        })
      }

      case 'CfdOnEtf': {
        return await this.#client.get({
          path,
          searchParams,
          guard: CostResponse[parameters.AssetType],
        })
      }

      case 'CfdOnEtn': {
        return await this.#client.get({
          path,
          searchParams,
          guard: CostResponse[parameters.AssetType],
        })
      }

      case 'CfdOnFund': {
        return await this.#client.get({
          path,
          searchParams,
          guard: CostResponse[parameters.AssetType],
        })
      }

      case 'CfdOnFutures': {
        return await this.#client.get({
          path,
          searchParams,
          guard: CostResponse[parameters.AssetType],
        })
      }

      case 'CfdOnIndex': {
        return await this.#client.get({
          path,
          searchParams,
          guard: CostResponse[parameters.AssetType],
        })
      }

      case 'CfdOnRights': {
        return await this.#client.get({
          path,
          searchParams,
          guard: CostResponse[parameters.AssetType],
        })
      }

      case 'CfdOnStock': {
        return await this.#client.get({
          path,
          searchParams,
          guard: CostResponse[parameters.AssetType],
        })
      }

      case 'CompanyWarrant': {
        return await this.#client.get({
          path,
          searchParams,
          guard: CostResponse[parameters.AssetType],
        })
      }

      case 'ContractFutures': {
        return await this.#client.get({
          path,
          searchParams,
          guard: CostResponse[parameters.AssetType],
        })
      }

      case 'Etc': {
        return await this.#client.get({
          path,
          searchParams,
          guard: CostResponse[parameters.AssetType],
        })
      }

      case 'Etf': {
        return await this.#client.get({
          path,
          searchParams,
          guard: CostResponse[parameters.AssetType],
        })
      }

      case 'Etn': {
        return await this.#client.get({
          path,
          searchParams,
          guard: CostResponse[parameters.AssetType],
        })
      }

      case 'Fund': {
        return await this.#client.get({
          path,
          searchParams,
          guard: CostResponse[parameters.AssetType],
        })
      }

      case 'FuturesOption': {
        return await this.#client.get({
          path,
          searchParams,
          guard: CostResponse[parameters.AssetType],
        })
      }

      case 'FxForwards': {
        return await this.#client.get({
          path,
          searchParams,
          guard: CostResponse[parameters.AssetType],
        })
      }

      case 'FxNoTouchOption': {
        return await this.#client.get({
          path,
          searchParams,
          guard: CostResponse[parameters.AssetType],
        })
      }

      case 'FxOneTouchOption': {
        return await this.#client.get({
          path,
          searchParams,
          guard: CostResponse[parameters.AssetType],
        })
      }

      case 'FxSpot': {
        return await this.#client.get({
          path,
          searchParams,
          guard: CostResponse[parameters.AssetType],
        })
      }

      case 'FxSwap': {
        return await this.#client.get({
          path,
          searchParams,
          guard: CostResponse[parameters.AssetType],
        })
      }

      case 'FxVanillaOption': {
        return await this.#client.get({
          path,
          searchParams,
          guard: CostResponse[parameters.AssetType],
        })
      }

      case 'Rights': {
        return await this.#client.get({
          path,
          searchParams,
          guard: CostResponse[parameters.AssetType],
        })
      }

      case 'Stock': {
        return await this.#client.get({
          path,
          searchParams,
          guard: CostResponse[parameters.AssetType],
        })
      }

      case 'StockIndexOption': {
        return await this.#client.get({
          path,
          searchParams,
          guard: CostResponse[parameters.AssetType],
        })
      }

      case 'StockOption': {
        return await this.#client.get({
          path,
          searchParams,
          guard: CostResponse[parameters.AssetType],
        })
      }
    }
  }
}
