import type { HTTPClient } from '../http-client.ts'
import { User } from '../types/records/user.ts'

export class UserResource {
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

  async me(): Promise<User> {
    return await this.#client.getJSON(this.#meURL, { guard: User })
  }
}
