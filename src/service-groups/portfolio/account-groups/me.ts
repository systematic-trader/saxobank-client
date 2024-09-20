import type { ResourceClient } from '../../../resource-client.ts'
import { AccountGroupResponse } from '../../../types/records/account-group-response.ts'

export class Me {
  readonly #client: ResourceClient

  constructor({ client }: { readonly client: ResourceClient }) {
    this.#client = client.appendPath('me')
  }

  /** Get all accounts gropus under a particular client to which the logged in user belongs. */
  async get(): Promise<ReadonlyArray<AccountGroupResponse>> {
    return await this.#client.getPaginated({
      searchParams: {
        $inlinecount: 'AllPages',
      },
      guard: AccountGroupResponse,
    })
  }
}
