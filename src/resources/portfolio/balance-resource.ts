import type { HTTPClient } from '../../http-client.ts'
import { urlJoin } from '../utils.ts'

export class BalanceResource {
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
    this.#resourceURL = urlJoin(prefixURL, 'port', 'v1', 'balances')
  }
}
