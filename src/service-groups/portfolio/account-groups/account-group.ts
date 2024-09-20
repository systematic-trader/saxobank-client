import type { ResourceClient } from '../../../resource-client.ts'
import { AccountGroupResponse } from '../../../types/records/account-group-response.ts'

// todo not tested (we have no account groups in simulation env)
export class AccountGroup {
  readonly #client: ResourceClient

  constructor({ client }: { readonly client: ResourceClient }) {
    this.#client = client
  }

  /** Get details about a single account group */
  async get({ AccountGroupKey, ClientKey }: {
    readonly AccountGroupKey: string
    readonly ClientKey: string
  }): Promise<ReadonlyArray<AccountGroupResponse>> {
    return await this.#client.getPaginated({
      path: AccountGroupKey,
      searchParams: {
        ClientKey,
      },
      guard: AccountGroupResponse,
    })
  }
}
