import { assertReturn } from 'https://raw.githubusercontent.com/systematic-trader/type-guard/main/mod.ts'
import type { ResourceClient } from '../../../resource-client.ts'
import type { AssetType } from '../../../types/derives/asset-type.ts'

import {
  InstrumentDetailsBond,
  InstrumentDetailsCfdOnCompanyWarrant,
  InstrumentDetailsCfdOnEtc,
  InstrumentDetailsCfdOnEtf,
  InstrumentDetailsCfdOnEtn,
  InstrumentDetailsCfdOnFund,
  InstrumentDetailsCfdOnFutures,
  InstrumentDetailsCfdOnIndex,
  InstrumentDetailsCfdOnRights,
  InstrumentDetailsCfdOnStock,
  InstrumentDetailsCompanyWarrant,
  InstrumentDetailsContractFutures,
  InstrumentDetailsEtc,
  InstrumentDetailsEtf,
  InstrumentDetailsEtn,
  InstrumentDetailsFund,
  InstrumentDetailsFuturesOption,
  InstrumentDetailsFuturesStrategy,
  InstrumentDetailsFxSpot,
  InstrumentDetailsFxVanillaOption,
  InstrumentDetailsMutualFund,
  InstrumentDetailsRights,
  InstrumentDetailsStock,
  InstrumentDetailsStockIndex,
  InstrumentDetailsStockIndexOption,
  InstrumentDetailsStockOption,
} from '../../../types/records/instrument-details.ts'

type InstrumentDetailsType =
  | InstrumentDetailsBond
  | InstrumentDetailsCfdOnCompanyWarrant
  | InstrumentDetailsCfdOnEtc
  | InstrumentDetailsCfdOnEtf
  | InstrumentDetailsCfdOnEtn
  | InstrumentDetailsCfdOnFund
  | InstrumentDetailsCfdOnFutures
  | InstrumentDetailsCfdOnIndex
  | InstrumentDetailsCfdOnRights
  | InstrumentDetailsCfdOnStock
  | InstrumentDetailsCompanyWarrant
  | InstrumentDetailsContractFutures
  | InstrumentDetailsEtc
  | InstrumentDetailsEtf
  | InstrumentDetailsEtn
  | InstrumentDetailsFund
  | InstrumentDetailsFuturesOption
  | InstrumentDetailsFuturesStrategy
  | InstrumentDetailsFxSpot
  | InstrumentDetailsFxVanillaOption
  | InstrumentDetailsMutualFund
  | InstrumentDetailsRights
  | InstrumentDetailsStock
  | InstrumentDetailsStockIndex
  | InstrumentDetailsStockIndexOption
  | InstrumentDetailsStockOption

type ExtractInstrumentDetails<T extends AssetType> = Extract<
  InstrumentDetailsType,
  { readonly AssetType: T }
>

export class InstrumentsDetails {
  readonly #client: ResourceClient
  readonly #path = 'details'

  constructor({ client }: { readonly client: ResourceClient }) {
    this.#client = client
  }

  async get<T extends AssetType = AssetType>({
    AssetTypes,
    Uics,
  }:
    | {
      readonly AssetTypes: ReadonlyArray<T>
      readonly Uics?: undefined | readonly number[]
    }
    | {
      readonly AssetTypes?: never
      readonly Uics: readonly number[]
    }): Promise<ReadonlyArray<[AssetType] extends [T] ? InstrumentDetailsType : ExtractInstrumentDetails<T>>> {
    const searchParams: Record<string, string> = {
      FieldGroups: 'OrderSetting,SupportedOrderTypeSettings,TradingSessions,MarketData',
    }

    if (AssetTypes !== undefined && AssetTypes.length > 0) {
      searchParams.AssetTypes = AssetTypes.join(',')
    }

    if (Uics !== undefined && Uics.length > 0) {
      searchParams.Uics = Uics.join(',')
    }

    // deno-lint-ignore no-explicit-any
    const instrumentsUnverified = await this.#client.getPaginated<any>(
      {
        path: this.#path,
        searchParams,
      },
    )

    const instruments = instrumentsUnverified.map((instrument: { AssetType: AssetType }) => {
      try {
        const { AssetType } = instrument

        switch (AssetType) {
          case 'Bond': {
            return assertReturn(InstrumentDetailsBond, instrument)
          }
          case 'CfdOnCompanyWarrant': {
            return assertReturn(
              InstrumentDetailsCfdOnCompanyWarrant,
              instrument,
            )
          }

          case 'CfdOnEtc': {
            return assertReturn(InstrumentDetailsCfdOnEtc, instrument)
          }

          case 'CfdOnEtf': {
            return assertReturn(InstrumentDetailsCfdOnEtf, instrument)
          }

          case 'CfdOnEtn': {
            return assertReturn(InstrumentDetailsCfdOnEtn, instrument)
          }

          case 'CfdOnFund': {
            return assertReturn(InstrumentDetailsCfdOnFund, instrument)
          }

          case 'CfdOnFutures': {
            return assertReturn(InstrumentDetailsCfdOnFutures, instrument)
          }

          case 'CfdOnIndex': {
            return assertReturn(InstrumentDetailsCfdOnIndex, instrument)
          }

          case 'CfdOnRights': {
            return assertReturn(InstrumentDetailsCfdOnRights, instrument)
          }

          case 'CfdOnStock': {
            return assertReturn(InstrumentDetailsCfdOnStock, instrument)
          }

          case 'CompanyWarrant': {
            return assertReturn(InstrumentDetailsCompanyWarrant, instrument)
          }

          case 'ContractFutures': {
            return assertReturn(InstrumentDetailsContractFutures, instrument)
          }

          case 'Etc': {
            return assertReturn(InstrumentDetailsEtc, instrument)
          }

          case 'Etf': {
            return assertReturn(InstrumentDetailsEtf, instrument)
          }

          case 'Etn': {
            return assertReturn(InstrumentDetailsEtn, instrument)
          }

          case 'Fund': {
            return assertReturn(InstrumentDetailsFund, instrument)
          }

          case 'FuturesOption': {
            return assertReturn(InstrumentDetailsFuturesOption, instrument)
          }

          case 'FuturesStrategy': {
            return assertReturn(InstrumentDetailsFuturesStrategy, instrument)
          }

          case 'FxSpot': {
            return assertReturn(InstrumentDetailsFxSpot, instrument)
          }

          case 'FxVanillaOption': {
            return assertReturn(InstrumentDetailsFxVanillaOption, instrument)
          }

          case 'MutualFund': {
            return assertReturn(InstrumentDetailsMutualFund, instrument)
          }

          case 'Rights': {
            return assertReturn(InstrumentDetailsRights, instrument)
          }

          case 'StockIndexOption': {
            return assertReturn(InstrumentDetailsStockIndexOption, instrument)
          }

          case 'StockIndex': {
            return assertReturn(InstrumentDetailsStockIndex, instrument)
          }

          case 'StockOption': {
            return assertReturn(InstrumentDetailsStockOption, instrument)
          }

          case 'Stock': {
            return assertReturn(InstrumentDetailsStock, instrument)
          }

          default: {
            throw new Error(`Unknown asset type: ${AssetType as string}`)
          }
        }
      } catch (error) {
        // deno-lint-ignore no-console
        console.error(instrument)
        throw error
      }
    })

    if (AssetTypes === undefined || AssetTypes.length === 0) {
      return instruments as unknown[] as ReadonlyArray<ExtractInstrumentDetails<T>>
    }

    const assetTypesSet = new Set<string>(AssetTypes)

    return instruments.filter((instrument) => assetTypesSet.has(instrument.AssetType)) as unknown[] as ReadonlyArray<
      ExtractInstrumentDetails<T>
    >
  }
}
