import type { HTTPClient } from '../http-client.ts'
import { EntitlementDetails } from '../types/records/entitlement-details.ts'
import { UserResponse } from '../types/records/user-response.ts'
import { User } from '../types/records/user.ts'
import { fetchPaginated } from './internal/fetch-paginated.ts'
import type { ActiveUsersFilter } from '../types/derives/active-users-filter.ts'
import type { EntitlementFieldSet } from '../types/derives/entitlement-field-set.ts'

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

  /** Get all users under a particular owner. */
  users(
    params?: undefined | {
      /** Specifies that the response to the request should include a count of the number of entries in the collection */
      readonly inlineCount?: undefined | boolean

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
    },
  ): Promise<ReadonlyArray<UserResponse>> {
    const url = new URL('https://gateway.saxobank.com/sim/openapi/port/v1/users')

    if (params?.inlineCount !== undefined) {
      url.searchParams.set('$inlinecount', String(params.inlineCount))
    }

    if (params?.skip !== undefined) {
      url.searchParams.set('$skip', String(params.skip))
    }

    if (params?.top !== undefined) {
      url.searchParams.set('$top', String(params.top))
    }

    if (params?.activeUsersFilter !== undefined) {
      url.searchParams.set('ActiveUsersFilter', params.activeUsersFilter)
    }

    if (params?.clientKey !== undefined) {
      url.searchParams.set('ClientKey', params.clientKey)
    }

    if (params?.includeSubUsers !== undefined) {
      url.searchParams.set('IncludeSubUsers', String(params.includeSubUsers))
    }

    return fetchPaginated({
      client: this.#client,
      url,
      guard: UserResponse,
    })
  }

  /** Get the details about a user. */
  user({ userKey }: {
    readonly userKey: string
  }): Promise<UserResponse> {
    const url = new URL(`https://gateway.saxobank.com/sim/openapi/port/v1/users/${userKey}`)

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
    const url = new URL(`https://gateway.saxobank.com/sim/openapi/port/v1/users/${userKey}/entitlements`)

    url.searchParams.set('EntitlementFieldSet', entitlementFieldSet)

    return fetchPaginated({
      client: this.#client,
      url,
      guard: EntitlementDetails,
    })
  }

  /** Get details about the logged in user. */
  async me(): Promise<User> {
    return await this.#client.getJSON(this.#meURL, { guard: User })
  }

  /** Enables the user to update preferred language, culture and timezone. */
  updatePreferences(): never {
    // todo this is a patch request
    // todo implement this
    throw new Error('Not implemented')
  }

  /** This operation retrieves a list of all client specific entitlements per exchanges for market data. */
  entitlements(
    params?: undefined | {
      readonly entitlementFieldSet?: undefined | EntitlementFieldSet
    },
  ): Promise<ReadonlyArray<EntitlementDetails>> {
    const url = new URL('https://gateway.saxobank.com/sim/openapi/port/v1/users/me/entitlements')

    if (params?.entitlementFieldSet !== undefined) {
      url.searchParams.set('EntitlementFieldSet', params.entitlementFieldSet)
    }

    return fetchPaginated({
      client: this.#client,
      url,
      guard: EntitlementDetails,
    })
  }
}
