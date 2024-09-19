import {
  array,
  assertReturn,
  enums,
  type GuardType,
  integer,
  optional,
  props,
  string,
  union,
} from 'https://raw.githubusercontent.com/systematic-trader/type-guard/main/mod.ts'
import type { HTTPClient } from '../../http-client.ts'
import { ChartRequestMode } from '../../types/derives/chart-request-mode.ts'
import { extractKeys, urlJoin } from '../utils.ts'
import { Horizon } from '../../types/derives/horizon.ts'
import { ChartResponse } from '../../types/records/chart-response.ts'
import { ChartSampleBidAskOHLC, ChartSampleOHLC } from '../../types/derives/chart-sample.ts'
import { DisplayAndFormat } from '../../types/derives/display-and-format.ts'

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
    mode: optional(ChartRequestMode),
    time: optional(string({ format: 'date-iso8601' })),
  }),

  props({
    mode: ChartRequestMode,
    time: string({ format: 'date-iso8601' }),
  }),
])
export const ChartsParametersGuard = props({
  assetType: enums(extractKeys(AssetTypeMap)),
  horizon: Horizon,
  uic: integer(),
  accountKey: optional(string()),
  count: optional(integer({
    minimum: 1,
    maximum: 1200,
  })),
})

export type ChartsParameters =
  & GuardType<typeof ChartsParametersGuard>
  & GuardType<typeof ChartsParametersModeAndTimeGuard>

/** Allows you to set up subscriptions for streamed charts data. */
export class ChartResource {
  readonly #client: HTTPClient
  readonly #resourceURL: URL

  constructor({
    client,
    prefixURL,
  }: {
    readonly client: HTTPClient
    readonly prefixURL: string
  }) {
    this.#client = client
    this.#resourceURL = urlJoin(prefixURL, 'chart', 'v3', 'charts')
  }

  /**
   * Returns timestamped OHLC samples for a single instrument identified by UIC and AssetType.
   * The covered time period and intervals between samples are controlled by the combination of parameters horizon, time, mode and count.
   */
  charts<ChartAssetType extends keyof typeof AssetTypeMap>(
    parameters:
      & {
        /** Asset type of the instrument. */
        readonly assetType: ChartAssetType

        /** The time period that each sample covers, in minutes. */
        readonly horizon: ChartsParameters['horizon']

        /** UIC (Universal Instrument Code) of the instrument. */
        readonly uic: ChartsParameters['uic']

        /** Optional */
        readonly accountKey?: ChartsParameters['accountKey']

        /** Specifies maximum number of samples to return, max 1200, default 1200. */
        readonly count?: ChartsParameters['count']
      }
      & (
        | ({
          /**
           * Mode specifies if the endpoint should returns samples "UpTo" or "From" the specified time.
           * The results will include the sample at the specified time.
           *
           * Please note that when mode=UpTo and count=1, sometimes the returned data will be empty.
           */
          readonly mode: NonNullable<ChartsParameters['mode']>

          /**
           * Specifies the time of a sample, which must either be the first (If mode="From") or the last (if mode="UpTo") in the returned data.
           * The time must be in ISO8601 format.
           * Minutes and seconds are ignored.
           */
          readonly time: NonNullable<ChartsParameters['time']>
        })
        | ({
          readonly mode?: undefined
          readonly time?: undefined
        })
      ),
  ): Promise<ChartResponseByAssetType<ChartAssetType>> {
    const { accountKey, assetType, count, horizon, uic } = assertReturn(ChartsParametersGuard, {
      assetType: parameters.assetType,
      horizon: parameters.horizon,
      uic: parameters.uic,
      accountKey: parameters.accountKey,
      count: parameters.count,
    })
    const { mode, time } = assertReturn(ChartsParametersModeAndTimeGuard, {
      mode: parameters.mode,
      time: parameters.time,
    })

    const url = urlJoin(this.#resourceURL)

    if (accountKey !== undefined) {
      url.searchParams.set('AccountKey', accountKey)
    }

    url.searchParams.set('AssetType', assetType)

    if (count !== undefined) {
      url.searchParams.set('Count', count.toString())
    }

    url.searchParams.set('Horizon', horizon.toString())

    if (mode !== undefined) {
      url.searchParams.set('Mode', mode)
    }

    if (time !== undefined) {
      url.searchParams.set('Time', time)
    }

    url.searchParams.set('Uic', uic.toString())

    url.searchParams.set('FieldGroups', ['ChartInfo', 'Data', 'DisplayAndFormat'].join(','))

    // deno-lint-ignore no-explicit-any -- // todo fix this
    return this.#client.getJSON<any>(url, {
      guard: AssetTypeMap[assetType],
    })
  }
}
