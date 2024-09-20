import type { ResourceClient } from '../../../resource-client.ts'
import { AccountResponse } from '../../../types/records/account-response.ts'

export class Me {
  readonly #client: ResourceClient

  constructor({ client }: { readonly client: ResourceClient }) {
    this.#client = client.appendPath('me')
  }

  /** Returns all accounts under a particular client to which the logged in user belongs. */
  async get(): Promise<ReadonlyArray<AccountResponse>> {
    return await this.#client.getPaginated({
      searchParams: {
        $inlinecount: 'AllPages',
      },
      guard: AccountResponse,
    })
  }
}
