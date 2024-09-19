import type { HTTPClient } from '../../http-client.ts'
import { EntitlementDetails } from '../../types/records/entitlement-details.ts'
import { UserResponse } from '../../types/records/user-response.ts'
import type { ActiveUsersFilter } from '../../types/derives/active-users-filter.ts'
import type { EntitlementFieldSet } from '../../types/derives/entitlement-field-set.ts'
import { fetchResourceData } from '../fetch-resource-data.ts'
import { urlJoin } from '../utils.ts'

/** End points serving user resources. */
export class UserResource {
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
    this.#resourceURL = urlJoin(prefixURL, 'port/v1/users')
  }

  /** Get all users under a particular owner. */
  users(
    { inlineCount, skip, top, activeUsersFilter, clientKey, includeSubUsers }: undefined | {
      /** Specifies that the response to the request should include a count of the number of entries in the collection */
      readonly inlineCount?: undefined | 'AllPages'

      /** The number of entries to skip from the beginning of the collection */
      readonly skip?: undefined | number

      /** The number of entries to return from the beginning of the collection */
      readonly top?: undefined | number

      /** Controls what users to be included in terms of active/inactive. Default is all users. */
      readonly activeUsersFilter?: undefined | ActiveUsersFilter

      /** Unique key identifying the owner. This is the ClientKey of the client under which the list of users belongs. Default: Logged-in user's client. */
      readonly clientKey?: undefined | string

      /** Set to true if users of all underlying partners should be included in output. */
      readonly includeSubUsers?: undefined | boolean
    } = {},
  ): Promise<ReadonlyArray<UserResponse>> {
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

    if (activeUsersFilter !== undefined) {
      url.searchParams.set('ActiveUsersFilter', activeUsersFilter)
    }

    if (clientKey !== undefined) {
      url.searchParams.set('ClientKey', clientKey)
    }

    if (includeSubUsers !== undefined) {
      url.searchParams.set('IncludeSubUsers', String(includeSubUsers))
    }

    return fetchResourceData({
      client: this.#client,
      url,
      guard: UserResponse,
    })
  }

  /** Get the details about a user. */
  user({ userKey }: {
    readonly userKey: string
  }): Promise<UserResponse> {
    const url = urlJoin(this.#resourceURL, userKey)
    return this.#client.getJSON(url, {
      guard: UserResponse,
    })
  }

  /** A representation with client specific entitlements per exchanges of market data about a user. */
  userEntitlements({ userKey, entitlementFieldSet }: {
    /** The unique key for the user's client. */
    readonly userKey: string

    /** Specifies which values to be returned in the Entitlements array. */
    readonly entitlementFieldSet: EntitlementFieldSet
  }): Promise<ReadonlyArray<EntitlementDetails>> {
    const url = urlJoin(this.#resourceURL, userKey, 'entitlements')

    url.searchParams.set('EntitlementFieldSet', entitlementFieldSet)

    return fetchResourceData({
      client: this.#client,
      url,
      guard: EntitlementDetails,
    })
  }

  /** Get details about the logged in user. */
  me(): Promise<UserResponse> {
    const url = urlJoin(this.#resourceURL, 'me')
    return this.#client.getJSON(url, { guard: UserResponse })
  }

  /** Enables the user to update preferred language, culture and timezone. */
  updatePreferences(): never {
    // todo this is a patch request
    // todo implement this
    throw new Error('Not implemented')
  }

  /** This operation retrieves a list of all client specific entitlements per exchanges for market data. */
  entitlements(
    { entitlementFieldSet }: undefined | {
      readonly entitlementFieldSet?: undefined | EntitlementFieldSet
    } = {},
  ): Promise<ReadonlyArray<EntitlementDetails>> {
    const url = urlJoin(this.#resourceURL, 'me', 'entitlements')

    if (entitlementFieldSet !== undefined) {
      url.searchParams.set('EntitlementFieldSet', entitlementFieldSet)
    }

    return fetchResourceData({
      client: this.#client,
      url,
      guard: EntitlementDetails,
    })
  }
}
