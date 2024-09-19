import type { ResourceClient } from '../../resource-client.ts'
import { ExchangeDetails } from '../../types/records/exchange-details.ts'

export class Exchanges {
  readonly #client: ResourceClient

  constructor({ client }: { readonly client: ResourceClient }) {
    this.#client = client.appendPath('v1/exchanges')
  }

  async get(): Promise<ReadonlyArray<ExchangeDetails>> {
    return await this.#client.getPaginated({ guard: ExchangeDetails })
  }
}
