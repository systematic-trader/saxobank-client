import type { HTTPClient } from '../../http-client.ts'
import { fetchResourceData } from '../fetch-resource-data.ts'
import { AccountResponse } from '../../types/records/account-response.ts'
import { urlJoin } from '../utils.ts'

/** End points serving accounts. The set of accounts is restricted by the supplied query parameters as well as whether or not the identity represented by the authorization token has access to the account. */
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
    this.#resourceURL = urlJoin(prefixURL, 'port', 'v1', 'accounts')
  }

  me({ inlineCount, skip, top }: {
    readonly inlineCount?: undefined | 'AllPages'
    readonly skip?: undefined | number
    readonly top?: undefined | number
  } = {}): Promise<ReadonlyArray<AccountResponse>> {
    const url = urlJoin(this.#resourceURL, 'me')

    if (inlineCount !== undefined) {
      url.searchParams.set('$inlinecount', inlineCount)
    }

    if (skip !== undefined) {
      url.searchParams.set('$skip', skip.toString())
    }

    if (top !== undefined) {
      url.searchParams.set('$top', top.toString())
    }

    return fetchResourceData({
      client: this.#client,
      url,
      guard: AccountResponse,
    })
  }
}
