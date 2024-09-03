import type { HTTPClient } from '../../http-client.ts'
import { Client } from '../../types/records/client.ts'
import { urlJoin } from '../utils.ts'

export class ClientResource {
  readonly #client: HTTPClient
  readonly #resourceURL: URL

  constructor({
    client,
    prefixURL,
  }: {
    readonly client: HTTPClient
    readonly prefixURL: string
  }) {
    this.#client = client
    this.#resourceURL = urlJoin(prefixURL, 'port', 'v1', 'clients')
  }

  async me(): Promise<Client> {
    const url = urlJoin(this.#resourceURL, 'me')
    return await this.#client.getJSON(url, { guard: Client })
  }
}
