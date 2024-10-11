import type { ServiceGroupClient } from '../../service-group-client.ts'
import { CountryDetails } from '../../types/records/country-details.ts'

export class Countries {
  readonly #client: ServiceGroupClient

  constructor({ client }: { readonly client: ServiceGroupClient }) {
    this.#client = client.appendPath('v1/countries')
  }

  async get(): Promise<ReadonlyArray<CountryDetails>> {
    return await this.#client.getPaginated({ guard: CountryDetails })
  }
}
