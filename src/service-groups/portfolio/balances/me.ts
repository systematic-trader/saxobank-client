import type { ResourceClient } from '../../../resource-client.ts'
import { BalanceResponse } from '../../../types/records/balance-response.ts'

export class Me {
  readonly #client: ResourceClient

  constructor({ client }: { readonly client: ResourceClient }) {
    this.#client = client.appendPath('me')
  }

  /** Get balance data for logged-in client. */
  async get(): Promise<BalanceResponse> {
    return await this.#client.get({
      searchParams: {
        $inlinecount: 'AllPages',
      },
      guard: BalanceResponse,
    })
  }
}
