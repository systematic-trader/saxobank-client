import { Environment } from './environment.ts'
import { HTTPClient } from './http-client.ts'
import { AccountGroupsResource } from './resources/account-group-resource.ts'
import { AccountResource } from './resources/account-resource.ts'
import { BalanceResource } from './resources/balance-resource.ts'
import { ClientResource } from './resources/client-resource.ts'
import { ClosedPositionResource } from './resources/closed-position-resource.ts'
import { ExposureResource } from './resources/exposure-resource.ts'
import { NetPositionResource } from './resources/net-position-resource.ts'
import { OrderResource } from './resources/order-resource.ts'
import { UserResource } from './resources/user-resource.ts'

export class SaxoBankClient {
  readonly #client: HTTPClient

  readonly accountGroups: AccountGroupsResource
  readonly account: AccountResource
  readonly balance: BalanceResource
  readonly client: ClientResource
  readonly closedPosition: ClosedPositionResource
  readonly exposure: ExposureResource
  readonly netPosition: NetPositionResource
  readonly order: OrderResource
  readonly position: ClosedPositionResource
  readonly user: UserResource

  constructor({
    token = Environment['SAXOBANK_API_AUTHORIZATION_BEARER_TOKEN'],
    prefixURL = Environment['SAXOBANK_API_PREFIX_URL'] ?? 'https://gateway.saxobank.com/sim/openapi',
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

    this.accountGroups = new AccountGroupsResource({ client: this.#client, prefixURL })
    this.account = new AccountResource({ client: this.#client, prefixURL })
    this.balance = new BalanceResource({ client: this.#client, prefixURL })
    this.client = new ClientResource({ client: this.#client, prefixURL })
    this.closedPosition = new ClosedPositionResource({ client: this.#client, prefixURL })
    this.exposure = new ExposureResource({ client: this.#client, prefixURL })
    this.netPosition = new NetPositionResource({ client: this.#client, prefixURL })
    this.order = new OrderResource({ client: this.#client, prefixURL })
    this.position = new ClosedPositionResource({ client: this.#client, prefixURL })
    this.user = new UserResource({ client: this.#client, prefixURL })
  }
}
