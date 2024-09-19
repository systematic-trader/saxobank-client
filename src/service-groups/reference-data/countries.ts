import type { ResourceClient } from '../../resource-client.ts'
import { CountryDetails } from '../../types/records/country-details.ts'

export class Countries {
  readonly #client: ResourceClient

  constructor({ client }: { readonly client: ResourceClient }) {
    this.#client = client.appendPath('v1/countries')
  }

  async get(): Promise<ReadonlyArray<CountryDetails>> {
    return await this.#client.getPaginated({ guard: CountryDetails })
  }
}
