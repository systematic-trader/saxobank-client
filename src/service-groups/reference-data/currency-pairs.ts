import type { ResourceClient } from '../../resource-client.ts'
import { CurrencyPairDetails } from '../../types/records/currency-pair-details.ts'

export class CurrencyPairs {
  readonly #client: ResourceClient

  constructor({ client }: { readonly client: ResourceClient }) {
    this.#client = client.appendPath('v1/currencypairs')
  }

  async get(): Promise<ReadonlyArray<CurrencyPairDetails>> {
    return await this.#client.getPaginated({ guard: CurrencyPairDetails })
  }
}
