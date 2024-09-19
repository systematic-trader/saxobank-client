import type { ResourceClient } from '../../../resource-client.ts'
import { StandardDate } from '../../../types/records/standard-date.ts'

export class FxOptionExpiry {
  readonly #client: ResourceClient

  constructor({ client }: { readonly client: ResourceClient }) {
    this.#client = client.appendPath('fxoptionexpiry')
  }

  async get({ Uic }: { readonly Uic: number | string }): Promise<ReadonlyArray<StandardDate>> {
    return await this.#client.getPaginated({
      path: `${Uic}`,
      guard: StandardDate,
    })
  }
}
