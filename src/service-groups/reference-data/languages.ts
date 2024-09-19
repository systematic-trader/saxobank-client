import type { ResourceClient } from '../../resource-client.ts'
import { LanguageDetails } from '../../types/records/language-details.ts'

export class Languages {
  readonly #client: ResourceClient

  constructor({ client }: { readonly client: ResourceClient }) {
    this.#client = client.appendPath('v1/languages')
  }

  async get(): Promise<ReadonlyArray<LanguageDetails>> {
    return await this.#client.getPaginated({ guard: LanguageDetails })
  }
}
