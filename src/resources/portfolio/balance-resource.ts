import type { HTTPClient } from '../../http-client.ts'
import { urlJoin } from '../utils.ts'

/** Read-only endpoint serving client and account balances. The client or account balance is identified by the supplied ClientKey, AccountGroupKey or AccountKey. Access to balance data is further restricted by the access rights of the identity represented by the authorization token. */
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
