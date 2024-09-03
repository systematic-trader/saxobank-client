import type { HTTPClient } from '../http-client.ts'
import { AccountGroupResponse } from '../types/records/account-group-response.ts'
import { fetchPaginated } from './internal/fetch-paginated.ts'

/** End points serving account groups. The set of account groups is restricted by the supplied query parameters as well as whether or not the identity represented by the authorization token has access to the groups. */
export class AccountGroupsResource {
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
    this.#resourceURL = new URL('port/v1/accountgroups/', prefixURL)
  }

  /** Get a list of all account groups used by the specified client */
  accountGroups({ inlineCount, skip, top, clientKey }: {
    readonly inlineCount?: undefined | 'AllPages'
    readonly skip?: undefined | number
    readonly top?: undefined | number
    readonly clientKey: string
  }): Promise<ReadonlyArray<AccountGroupResponse>> {
    const url = new URL(this.#resourceURL)

    if (inlineCount !== undefined) {
      url.searchParams.set('$inlinecount', inlineCount)
    }

    if (skip !== undefined) {
      url.searchParams.set('$skip', skip.toString())
    }

    if (top !== undefined) {
      url.searchParams.set('$top', top.toString())
    }

    url.searchParams.set('ClientKey', clientKey)

    return fetchPaginated({
      client: this.#client,
      url,
      guard: AccountGroupResponse,
    })
  }

  accountGroup({ accountGroupKey, clientKey }: {
    readonly accountGroupKey: string
    readonly clientKey: string
  }): Promise<AccountGroupResponse> {
    const url = new URL(this.#resourceURL)

    url.searchParams.set('AccountGroupKey', accountGroupKey)
    url.searchParams.set('ClientKey', clientKey)

    return this.#client.getJSON(url, {
      guard: AccountGroupResponse,
    })
  }

  updateAccountGroup(_params: {
    readonly accountGroupKey: string
    readonly accountValueProtectionLimit?: undefined | number
    readonly clientKey: string
  }): Promise<never> {
    // todo Simulation environment does not have any account groups to test on
    throw new Error('Not implemented')
  }

  /** Get all accounts gropus under a particular client to which the logged in user belongs. */
  me({ inlineCount, skip, top }: {
    readonly inlineCount?: undefined | 'AllPages'
    readonly skip?: undefined | number
    readonly top?: undefined | number
  } = {}): Promise<ReadonlyArray<AccountGroupResponse>> {
    const url = new URL('me', this.#resourceURL)

    if (inlineCount !== undefined) {
      url.searchParams.set('$inlinecount', inlineCount)
    }

    if (skip !== undefined) {
      url.searchParams.set('$skip', skip.toString())
    }

    if (top !== undefined) {
      url.searchParams.set('$top', top.toString())
    }

    return fetchPaginated({
      client: this.#client,
      url,
      guard: AccountGroupResponse,
    })
  }
}
