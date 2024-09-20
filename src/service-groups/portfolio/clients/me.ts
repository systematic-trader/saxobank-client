import type { ResourceClient } from '../../../resource-client.ts'
import { ClientResponse } from '../../../types/records/client-response.ts'

export class Me {
  readonly #client: ResourceClient

  constructor({ client }: { readonly client: ResourceClient }) {
    this.#client = client.appendPath('me')
  }

  /** Get details about logged-in user's client */
  async get(): Promise<ClientResponse> {
    return await this.#client.get({
      searchParams: {
        $inlinecount: 'AllPages',
      },
      guard: ClientResponse,
    })
  }
}
