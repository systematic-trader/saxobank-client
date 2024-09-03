import type { HTTPClient } from '../../http-client.ts'
import { urlJoin } from '../utils.ts'

/**
 * Read only end points serving exposure of positions. The exposure results are restricted by the supplied query parameters as well as whether or not the identity represented by the authorization token has access to the client/account owner of the underlying positions.
 * - A user of a client will have access to accounts under that client
 * - A user of an IB or WLC will have access to accounts on that client or clients there under
 * - An employee has access to all accounts
 */
export class ExposureResource {
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
    this.#resourceURL = urlJoin(prefixURL, 'port', 'v1', 'exposure')
  }
}
