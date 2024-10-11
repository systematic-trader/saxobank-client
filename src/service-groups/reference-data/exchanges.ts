import type { ServiceGroupClient } from '../../service-group-client.ts'
import { ExchangeDetails } from '../../types/records/exchange-details.ts'

export class Exchanges {
  readonly #client: ServiceGroupClient

  constructor({ client }: { readonly client: ServiceGroupClient }) {
    this.#client = client.appendPath('v1/exchanges')
  }

  async get({ exchangeId }: { exchangeId: string }): Promise<ExchangeDetails>
  async get({ exchangeId }: { exchangeId?: undefined }): Promise<ReadonlyArray<ExchangeDetails>>
  async get(): Promise<ReadonlyArray<ExchangeDetails>>
  async get(
    { exchangeId }: { exchangeId?: undefined | string } = {},
  ): Promise<ReadonlyArray<ExchangeDetails> | ExchangeDetails> {
    if (exchangeId === undefined) {
      return await this.#client.getPaginated({ guard: ExchangeDetails })
    }

    return await this.#client.get({ guard: ExchangeDetails, path: exchangeId })
  }
}
