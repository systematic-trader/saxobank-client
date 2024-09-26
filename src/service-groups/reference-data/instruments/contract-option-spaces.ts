import { HTTPClientError } from '../../../http-client.ts'
import type { ResourceClient } from '../../../resource-client.ts'
import type { OptionSpaceSegment } from '../../../types/derives/option-space-segment.ts'
import type { TradingStatus } from '../../../types/derives/trading-status.ts'
import { OptionDetails } from '../../../types/records/option-details.ts'

export class ContractOptionSpaces {
  readonly #client: ResourceClient

  constructor({ client }: { readonly client: ResourceClient }) {
    this.#client = client.appendPath('contractoptionspaces')
  }

  async get(options: {
    readonly OptionRootId: number
    readonly CanParticipateInMultiLegOrder?: undefined | boolean
    readonly ClientKey?: undefined | string
    readonly ExpiryDates?: undefined | readonly string[]
    readonly OptionSpaceSegment?: undefined | OptionSpaceSegment
    readonly TradingStatus?: undefined | TradingStatus
    readonly UnderlyingUic?: undefined | number
  }): Promise<undefined | OptionDetails> {
    const { OptionRootId, ...searchParams } = options

    try {
      return await this.#client.get({ path: String(OptionRootId), searchParams, guard: OptionDetails })
    } catch (error) {
      if (error instanceof HTTPClientError && error.statusCode === 404) {
        return undefined
      }

      throw error
    }
  }
}
