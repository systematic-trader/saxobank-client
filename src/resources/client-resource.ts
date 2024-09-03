import type { HTTPClient } from '../http-client.ts'
import { Client } from '../types/records/client.ts'

export class ClientResource {
  #client: HTTPClient

  constructor(client: HTTPClient) {
    this.#client = client
  }

  async me(): Promise<Client> {
    return await this.#client.getJSON('https://gateway.saxobank.com/sim/openapi/port/v1/clients/me', {
      guard: Client,
    })
  }
}
