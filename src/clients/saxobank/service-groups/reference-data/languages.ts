import type { ServiceGroupClient } from '../../service-group-client.ts'
import { LanguageDetails } from '../../types/records/language-details.ts'

export class Languages {
  readonly #client: ServiceGroupClient

  constructor({ client }: { readonly client: ServiceGroupClient }) {
    this.#client = client.appendPath('v1/languages')
  }

  async get(): Promise<ReadonlyArray<LanguageDetails>> {
    return await this.#client.getPaginated({ guard: LanguageDetails })
  }
}
