import type { ResourceClient } from '../../resource-client.ts'
import { type AssetType, AssetTypeValues } from '../../types/derives/asset-type.ts'
import type { ClassType } from '../../types/derives/class.ts'

import { assertReturn } from 'https://raw.githubusercontent.com/systematic-trader/type-guard/main/mod.ts'

import {
  InstrumentSummaryInfoBond,
  InstrumentSummaryInfoCfdOnCompanyWarrant,
  InstrumentSummaryInfoCfdOnEtc,
  InstrumentSummaryInfoCfdOnEtf,
  InstrumentSummaryInfoCfdOnEtn,
  InstrumentSummaryInfoCfdOnFund,
  InstrumentSummaryInfoCfdOnFutures,
  InstrumentSummaryInfoCfdOnIndex,
  InstrumentSummaryInfoCfdOnRights,
  InstrumentSummaryInfoCfdOnStock,
  InstrumentSummaryInfoCompanyWarrant,
  InstrumentSummaryInfoContractFutures,
  InstrumentSummaryInfoEtc,
  InstrumentSummaryInfoEtf,
  InstrumentSummaryInfoEtn,
  InstrumentSummaryInfoFund,
  InstrumentSummaryInfoFuturesOption,
  InstrumentSummaryInfoFuturesStrategy,
  InstrumentSummaryInfoFxForwards,
  InstrumentSummaryInfoFxNoTouchOption,
  InstrumentSummaryInfoFxOneTouchOption,
  InstrumentSummaryInfoFxSpot,
  InstrumentSummaryInfoFxSwap,
  InstrumentSummaryInfoFxVanillaOption,
  InstrumentSummaryInfoMutualFund,
  InstrumentSummaryInfoRights,
  InstrumentSummaryInfoStock,
  InstrumentSummaryInfoStockIndex,
  InstrumentSummaryInfoStockIndexOption,
  InstrumentSummaryInfoStockOption,
  type InstrumentSummaryInfoType,
} from '../../types/records/instrument-summary-info.ts'
import { ContractFuturesSpaces } from './instruments/contract-futures-spaces.ts'
import { InstrumentsDetails } from './instruments/details.ts'
import { TradingSchedule } from './instruments/trading-schedule.ts'

export class Instruments {
  readonly #client: ResourceClient

  readonly details: InstrumentsDetails
  readonly futuresspaces: ContractFuturesSpaces
  readonly tradingschedule: TradingSchedule

  constructor({ client }: { readonly client: ResourceClient }) {
    this.#client = client.appendPath('v1/instruments')

    this.details = new InstrumentsDetails({ client: this.#client })
    this.futuresspaces = new ContractFuturesSpaces({ client: this.#client })
    this.tradingschedule = new TradingSchedule({ client: this.#client })
  }

  async get<T extends AssetType>(
    options: {
      readonly limit?: undefined | number
      readonly AccountKey?: undefined | string
      readonly AssetTypes: readonly [T, ...ReadonlyArray<T>]
      readonly CanParticipateInMultiLegOrder?: undefined | boolean
      readonly Class?: undefined | ReadonlyArray<ClassType>
      readonly ExchangeId?: undefined | string
      readonly IncludeNonTradable?: undefined | boolean
      readonly Keywords?: undefined | ReadonlyArray<string>
      readonly Tags?: undefined | ReadonlyArray<string>
      readonly Uics?: undefined | ReadonlyArray<number>
    },
  ): Promise<
    ReadonlyArray<
      Extract<
        InstrumentSummaryInfoType,
        { readonly AssetType: T }
      >
    >
  >

  async get<T extends AssetType>(
    options?: undefined | {
      readonly limit?: undefined | number
      readonly AccountKey?: undefined | string
      readonly AssetTypes?: undefined | readonly []
      readonly CanParticipateInMultiLegOrder?: undefined | boolean
      readonly Class?: undefined | ReadonlyArray<ClassType>
      readonly ExchangeId?: undefined | string
      readonly IncludeNonTradable?: undefined | boolean
      readonly Keywords?: undefined | ReadonlyArray<string>
      readonly Tags?: undefined | ReadonlyArray<string>
      readonly Uics?: undefined | ReadonlyArray<number>
    },
  ): Promise<ReadonlyArray<InstrumentSummaryInfoType>>

  async get(
    options: undefined | {
      readonly limit?: undefined | number
      readonly AccountKey?: undefined | string
      readonly AssetTypes?: undefined | ReadonlyArray<AssetType>
      readonly CanParticipateInMultiLegOrder?: undefined | boolean
      readonly Class?: undefined | ReadonlyArray<ClassType>
      readonly ExchangeId?: undefined | string
      readonly IncludeNonTradable?: undefined | boolean
      readonly Keywords?: undefined | ReadonlyArray<string>
      readonly Tags?: undefined | ReadonlyArray<string>
      readonly Uics?: undefined | ReadonlyArray<number>
    } = {},
  ): Promise<ReadonlyArray<InstrumentSummaryInfoType>> {
    const { limit, Keywords, AssetTypes, ...rest } = options

    const searchParams = {
      ...rest,
      ...(AssetTypes === undefined || AssetTypes.length === 0 ? { AssetTypes: AssetTypeValues } : { AssetTypes }),
      ...(Keywords === undefined || Keywords.length === 0 ? {} : { Keywords: Keywords.join(' ') }),
    }

    const instrumentsUnverified = await this.#client.getPaginated<InstrumentSummaryInfoType>({
      searchParams,
      limit,
    })

    const instruments = instrumentsUnverified.map(
      (instrument) => {
        try {
          const { AssetType } = instrument

          switch (AssetType) {
            case 'Bond': {
              return assertReturn(InstrumentSummaryInfoBond, instrument)
            }

            case 'CfdOnCompanyWarrant': {
              return assertReturn(
                InstrumentSummaryInfoCfdOnCompanyWarrant,
                instrument,
              )
            }

            case 'CfdOnEtc': {
              return assertReturn(InstrumentSummaryInfoCfdOnEtc, instrument)
            }

            case 'CfdOnEtf': {
              return assertReturn(InstrumentSummaryInfoCfdOnEtf, instrument)
            }

            case 'CfdOnEtn': {
              return assertReturn(InstrumentSummaryInfoCfdOnEtn, instrument)
            }

            case 'CfdOnFund': {
              return assertReturn(InstrumentSummaryInfoCfdOnFund, instrument)
            }

            case 'CfdOnFutures': {
              return assertReturn(InstrumentSummaryInfoCfdOnFutures, instrument)
            }

            case 'CfdOnIndex': {
              return assertReturn(InstrumentSummaryInfoCfdOnIndex, instrument)
            }

            case 'CfdOnRights': {
              return assertReturn(InstrumentSummaryInfoCfdOnRights, instrument)
            }

            case 'CfdOnStock': {
              return assertReturn(InstrumentSummaryInfoCfdOnStock, instrument)
            }

            case 'CompanyWarrant': {
              return assertReturn(
                InstrumentSummaryInfoCompanyWarrant,
                instrument,
              )
            }

            case 'ContractFutures': {
              return assertReturn(
                InstrumentSummaryInfoContractFutures,
                instrument,
              )
            }

            case 'Etc': {
              return assertReturn(InstrumentSummaryInfoEtc, instrument)
            }

            case 'Etf': {
              return assertReturn(InstrumentSummaryInfoEtf, instrument)
            }

            case 'Etn': {
              return assertReturn(InstrumentSummaryInfoEtn, instrument)
            }

            case 'Fund': {
              return assertReturn(InstrumentSummaryInfoFund, instrument)
            }

            case 'FuturesOption': {
              return assertReturn(
                InstrumentSummaryInfoFuturesOption,
                instrument,
              )
            }

            case 'FuturesStrategy': {
              return assertReturn(
                InstrumentSummaryInfoFuturesStrategy,
                instrument,
              )
            }

            case 'FxSpot': {
              return assertReturn(InstrumentSummaryInfoFxSpot, instrument)
            }

            case 'FxSwap': {
              return assertReturn(InstrumentSummaryInfoFxSwap, instrument)
            }

            case 'FxForwards': {
              return assertReturn(InstrumentSummaryInfoFxForwards, instrument)
            }

            case 'FxNoTouchOption': {
              return assertReturn(InstrumentSummaryInfoFxNoTouchOption, instrument)
            }

            case 'FxOneTouchOption': {
              return assertReturn(InstrumentSummaryInfoFxOneTouchOption, instrument)
            }

            case 'FxVanillaOption': {
              return assertReturn(
                InstrumentSummaryInfoFxVanillaOption,
                instrument,
              )
            }

            case 'MutualFund': {
              return assertReturn(InstrumentSummaryInfoMutualFund, instrument)
            }

            case 'Rights': {
              return assertReturn(InstrumentSummaryInfoRights, instrument)
            }

            case 'StockIndexOption': {
              return assertReturn(
                InstrumentSummaryInfoStockIndexOption,
                instrument,
              )
            }

            case 'StockIndex': {
              return assertReturn(InstrumentSummaryInfoStockIndex, instrument)
            }

            case 'StockOption': {
              return assertReturn(InstrumentSummaryInfoStockOption, instrument)
            }

            case 'Stock': {
              return assertReturn(InstrumentSummaryInfoStock, instrument)
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
      },
    )

    if (options.AssetTypes === undefined || options.AssetTypes.length === 0) {
      return instruments
    }

    const assetTypesSet = new Set<string>(options.AssetTypes)

    // Saxobank API filtering by asset type cannot be trusted
    return instruments.filter((instrument) => assetTypesSet.has(instrument.AssetType))
  }
}
