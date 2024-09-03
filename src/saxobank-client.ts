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
  }: {
    readonly token?: undefined | string
  } = {}) {
    if (token === undefined) {
      throw new Error('No token provided')
    }

    this.#client = HTTPClient.withBearerToken(token)

    this.client = new ClientResource(this.#client)
    this.user = new UserResource(this.#client)
  }
}
