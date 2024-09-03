import type { HTTPClient } from '../http-client.ts'
import { Client } from '../types/records/client.ts'

export class ClientResource {
  #client: HTTPClient
  #meURL: URL

  constructor({
    client,
    prefixURL,
  }: {
    readonly client: HTTPClient
    readonly prefixURL: string
  }) {
    this.#client = client
    this.#meURL = new URL('port/v1/clients/me', prefixURL)
  }

  async me(): Promise<Client> {
    return await this.#client.getJSON(this.#meURL, { guard: Client })
  }
}
