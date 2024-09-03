import { Environment } from './environment.ts'
import { HTTPClient } from './http-client.ts'
import { ClientResource } from './resources/client-resource.ts'
import { UserResource } from './resources/user-resource.ts'

export class SaxoBankClient {
  readonly #client: HTTPClient

  readonly client: ClientResource
  readonly user: UserResource

  constructor({
    token = Environment['SAXOBANK_API_AUTHORIZATION_BEARER_TOKEN'],
    prefixURL = Environment['SAXOBANK_API_PREFIX_URL'] ??
      'https://gateway.saxobank.com/sim/openapi',
  }: {
    readonly token?: undefined | string
    readonly prefixURL?: undefined | string
  } = {}) {
    if (token === undefined) {
      throw new Error('No token provided')
    }

    if (prefixURL === undefined) {
      throw new Error('No prefix URL provided')
    }

    this.#client = HTTPClient.withBearerToken(token)

    this.client = new ClientResource({ client: this.#client, prefixURL })
    this.user = new UserResource({ client: this.#client, prefixURL })
  }
}
