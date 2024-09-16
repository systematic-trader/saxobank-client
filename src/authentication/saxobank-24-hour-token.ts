import { Environment } from '../environment.ts'
import type { SaxoBankAuthorization } from './saxobank-authentication.ts'

/**
 * A temporary access token can be generated here: https://www.developer.saxo/openapi/token/current
 * This will grant temporary access to the simulation/demo environment.
 *
 * Please note that the site states that the token will expire after 24 hours.
 * This might not be true, as the tokens generated seems to be valid for much longer.
 */
export class SaxoBank24HourToken implements SaxoBankAuthorization {
  #temporaryToken: string

  constructor({ temporaryToken = Environment['SAXOBANK_AUTHORIZATION_24_HOUR_TOKEN'] }: {
    readonly temporaryToken?: string | undefined
  } = {}) {
    if (temporaryToken === undefined) {
      throw new TypeError(`No temporary token provided`)
    }

    this.#temporaryToken = temporaryToken
  }

  get accessToken(): string {
    return this.#temporaryToken
  }
}
