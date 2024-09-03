import type { HTTPClient } from '../../http-client.ts'
import { Client } from '../../types/records/client.ts'

export class ClientResource {
  #client: HTTPClient
  #resourceURL: URL

  constructor({
    client,
    prefixURL,
  }: {
    readonly client: HTTPClient
    readonly prefixURL: string
  }) {
    this.#client = client
    this.#resourceURL = new URL('port/v1/clients/', prefixURL)
  }

  async me(): Promise<Client> {
    const url = new URL('me', this.#resourceURL)
    return await this.#client.getJSON(url, { guard: Client })
  }
}
