import type { HTTPClient } from '../../http-client.ts'
import { ClientResponse } from '../../types/records/client-response.ts'
import { urlJoin } from '../utils.ts'

/** End points serving client related resources The set of clients is restricted by the supplied query parameters as well as whether or not the identity represented by the authorization token has access to the client. */
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

  me(): Promise<ClientResponse> {
    const url = urlJoin(this.#resourceURL, 'me')
    return this.#client.getJSON(url, {
      guard: ClientResponse,
    })
  }
}
