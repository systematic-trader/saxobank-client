import type { ResourceClient } from '../../../resource-client.ts'
import { StandardDate } from '../../../types/records/standard-date.ts'

export class ForwardTenor {
  readonly #client: ResourceClient

  constructor({ client }: { readonly client: ResourceClient }) {
    this.#client = client.appendPath('forwardtenor')
  }

  async get(
    { Uic, AccountKey }: { readonly Uic: number | string; readonly AccountKey: number | string },
  ): Promise<ReadonlyArray<StandardDate>> {
    return await this.#client.getPaginated({
      path: String(Uic),
      searchParams: { AccountKey: String(AccountKey) },
      guard: StandardDate,
    })
  }
}
