import type { HTTPClient } from '../http-client.ts'

export class AccountResource {
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
    this.#resourceURL = new URL('port/v1/accounts/', prefixURL)
  }
}
