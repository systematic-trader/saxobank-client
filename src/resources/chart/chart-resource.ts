import {
  array,
  assert,
  enums,
  type GuardType,
  integer,
  optional,
  props,
  string,
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

const ChartResponseOHLCBidAsk = ChartResponse.merge({
  Data: array(ChartSampleBidAskOHLC),
})

// todo missing CfdOnFutures
// todo we might be missing more (why would chartSampleFieldSet specify that it's only relevant for Warrants, MiniFutures and Certificates, if we can't get some of these?)
const AssetTypeMap = {
  Bond: ChartResponseOHLCBond,

  CompanyWarrant: ChartResponseOHLC,
  CfdOnCompanyWarrant: ChartResponseOHLC,

  ContractFutures: ChartResponseOHLC,

  Etc: ChartResponseOHLC,
  CfdOnEtc: ChartResponseOHLC,

  Etf: ChartResponseOHLC,
  CfdOnEtf: ChartResponseOHLC,

  Etn: ChartResponseOHLC,
  CfdOnEtn: ChartResponseOHLC,

  Fund: ChartResponseOHLC,
  CfdOnFund: ChartResponseOHLC,

  FxSpot: ChartResponseOHLCBidAsk,

  Rights: ChartResponseOHLC,
  CfdOnRights: ChartResponseOHLC,

  Stock: ChartResponseOHLC,
  CfdOnStock: ChartResponseOHLC,

  StockIndex: ChartResponseOHLC,
  CfdOnIndex: ChartResponseOHLCBidAsk,
} as const

type ChartResponseByAssetType<T extends keyof typeof AssetTypeMap> = GuardType<typeof AssetTypeMap[T]>

export const ChartsParametersGuard = props({
  accountKey: optional(string()),
  assetType: enums(extractKeys(AssetTypeMap)),
  // chartSampleFieldSet: optional(ChartSampleFieldSet), // todo consider if we should support this
  count: optional(integer({ minimum: 1, maximum: 1200 })),
  horizon: Horizon,
  mode: optional(ChartRequestMode),
  time: optional(string({ format: 'date-iso8601' })),
  uic: integer(),
})

export interface ChartsParameters extends GuardType<typeof ChartsParametersGuard> {}

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

  charts<AssetType extends keyof typeof AssetTypeMap>(parameters: {
    readonly accountKey?: ChartsParameters['accountKey']
    readonly assetType: AssetType
    readonly count?: ChartsParameters['count']
    readonly horizon: ChartsParameters['horizon']
    readonly mode?: ChartsParameters['mode']
    readonly time?: ChartsParameters['time']
    readonly uic: ChartsParameters['uic']
  }): Promise<ChartResponseByAssetType<AssetType>> {
    assert(ChartsParametersGuard, parameters)
    const { accountKey, assetType, count, horizon, mode, time, uic } = parameters

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
