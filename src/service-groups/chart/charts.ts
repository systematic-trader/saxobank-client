import {
  array,
  assertReturn,
  enums,
  type GuardType,
  integer,
  never,
  optional,
  props,
  string,
  union,
} from 'https://raw.githubusercontent.com/systematic-trader/type-guard/main/mod.ts'
import type { ResourceClient } from '../../resource-client.ts'
import { ChartResponse } from '../../types/records/chart-response.ts'
import { ChartSampleBidAskOHLC, ChartSampleOHLC } from '../../types/derives/chart-sample.ts'
import { DisplayAndFormat } from '../../types/derives/display-and-format.ts'
import { ChartRequestMode } from '../../types/derives/chart-request-mode.ts'
import { extractKeys } from '../utils.ts'
import { Horizon } from '../../types/derives/horizon.ts'
import type { ChartFieldGroupSpec } from '../../types/derives/chart-field-group-spec.ts'

const ChartResponseOHLC = ChartResponse.merge({
  Data: array(ChartSampleOHLC),
})

const ChartResponseOHLCBond = ChartResponse.merge({
  DisplayAndFormat: DisplayAndFormat.pick(['Decimals', 'Format']),
  Data: array(ChartSampleOHLC),
})

const ChartResponseBidAskOHLC = ChartResponse.merge({
  Data: array(ChartSampleBidAskOHLC),
})

const AssetTypeMap = {
  Bond: ChartResponseOHLCBond,

  CompanyWarrant: ChartResponseOHLC,
  CfdOnCompanyWarrant: ChartResponseOHLC,

  ContractFutures: ChartResponseOHLC,
  CfdOnFutures: ChartResponseBidAskOHLC,

  Etc: ChartResponseOHLC,
  CfdOnEtc: ChartResponseOHLC,

  Etf: ChartResponseOHLC,
  CfdOnEtf: ChartResponseOHLC,

  Etn: ChartResponseOHLC,
  CfdOnEtn: ChartResponseOHLC,

  Fund: ChartResponseOHLC,
  CfdOnFund: ChartResponseOHLC,

  FxSpot: ChartResponseBidAskOHLC,

  Rights: ChartResponseOHLC,
  CfdOnRights: ChartResponseOHLC,

  Stock: ChartResponseOHLC,
  CfdOnStock: ChartResponseOHLC,

  StockIndex: ChartResponseOHLC,
  CfdOnIndex: ChartResponseBidAskOHLC,
} as const

type ChartResponseByAssetType<T extends keyof typeof AssetTypeMap> = GuardType<typeof AssetTypeMap[T]>

const ChartsParametersModeAndTimeGuard = union([
  props({
    Mode: optional(never()),
    Time: optional(never()),
  }),

  props({
    Mode: ChartRequestMode,
    Time: string({ format: 'date-iso8601' }),
  }),
])

const ChartsParametersGuard = props({
  AssetType: enums(extractKeys(AssetTypeMap)),
  Horizon: Horizon,
  Uic: integer(),
  AccountKey: optional(string()),
  Count: optional(integer({ minimum: 1, maximum: 1200 })),
})

export type ChartsParameters =
  & GuardType<typeof ChartsParametersGuard>
  & GuardType<typeof ChartsParametersModeAndTimeGuard>

export class Charts {
  readonly #client: ResourceClient

  constructor({ client }: { readonly client: ResourceClient }) {
    this.#client = client.appendPath('v3/charts')
  }

  async get<ChartAssetType extends keyof typeof AssetTypeMap>(
    parameters:
      & {
        /** Asset type of the instrument. */
        readonly AssetType: ChartAssetType

        /** The time period that each sample covers, in minutes. */
        readonly Horizon: ChartsParameters['Horizon']

        /** UIC (Universal Instrument Code) of the instrument. */
        readonly Uic: ChartsParameters['Uic']

        /** Optional */
        readonly AccountKey?: ChartsParameters['AccountKey']

        /** Specifies maximum number of samples to return, max 1200, default 1200. */
        readonly Count?: ChartsParameters['Count']
      }
      & (
        | ({
          /**
           * Mode specifies if the endpoint should returns samples "UpTo" or "From" the specified time.
           * The results will include the sample at the specified time.
           *
           * Please note that when Mode=UpTo and count=1, sometimes the returned data will be empty.
           */
          readonly Mode: NonNullable<ChartsParameters['Mode']>

          /**
           * Specifies the time of a sample, which must either be the first (If Mode="From") or the last (if Mode="UpTo") in the returned data.
           * The time must be in ISO8601 format.
           * Minutes and seconds are ignored.
           */
          readonly Time: NonNullable<ChartsParameters['Time']>
        })
        | ({
          readonly Mode?: undefined
          readonly Time?: undefined
        })
      ),
  ): Promise<ChartResponseByAssetType<ChartAssetType>> {
    const { AssetType, AccountKey, Count, Horizon, Uic } = assertReturn(ChartsParametersGuard, {
      AssetType: parameters.AssetType,
      AccountKey: parameters.AccountKey,
      Count: parameters.Count,
      Horizon: parameters.Horizon,
      Uic: parameters.Uic,
    })

    const { Mode, Time } = assertReturn(ChartsParametersModeAndTimeGuard, {
      Mode: parameters.Mode,
      Time: parameters.Time,
    })

    const FieldGroups: readonly ChartFieldGroupSpec[] = ['ChartInfo', 'Data', 'DisplayAndFormat']

    return await this.#client.get<unknown>({
      searchParams: {
        AccountKey,
        AssetType,
        Count,
        Horizon,
        Uic,
        Mode,
        Time,
        FieldGroups,
      },
      guard: AssetTypeMap[parameters.AssetType],
    }) as unknown as Promise<ChartResponseByAssetType<ChartAssetType>>
  }
}
