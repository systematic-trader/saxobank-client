import type { ServiceGroupClient } from '../../service-group-client.ts'
import { CultureDetails } from '../../types/records/culture-details.ts'

export class Cultures {
  readonly #client: ServiceGroupClient

  constructor({ client }: { readonly client: ServiceGroupClient }) {
    this.#client = client.appendPath('v1/cultures')
  }

  async get(): Promise<ReadonlyArray<CultureDetails>> {
    return await this.#client.getPaginated({ guard: CultureDetails })
  }
}
