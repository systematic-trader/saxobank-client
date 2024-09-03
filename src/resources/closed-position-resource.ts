import type { HTTPClient } from '../http-client.ts'

export class ClosedPositionResource {
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
    this.#resourceURL = new URL('port/v1/closedpositions/', prefixURL)
  }
}
