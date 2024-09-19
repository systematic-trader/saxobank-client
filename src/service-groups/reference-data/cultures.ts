import type { ResourceClient } from '../../resource-client.ts'
import { CultureDetails } from '../../types/records/culture-details.ts'

export class Cultures {
  readonly #client: ResourceClient

  constructor({ client }: { readonly client: ResourceClient }) {
    this.#client = client.appendPath('v1/cultures')
  }

  async get(): Promise<ReadonlyArray<CultureDetails>> {
    return await this.#client.getPaginated({ guard: CultureDetails })
  }
}
