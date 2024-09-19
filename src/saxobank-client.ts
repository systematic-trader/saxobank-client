import type { SaxoBankAuthorization } from './authentication/saxobank-authentication.ts'
import { Environment } from './environment.ts'
import { HTTPClient } from './http-client.ts'
import { ResourceClient } from './resource-client.ts'
import { ChartResource } from './service-groups/chart/chart-resource.ts'
import { AccountGroupResource } from './service-groups/portfolio/account-group-resource.ts'
import { AccountResource } from './service-groups/portfolio/account-resource.ts'
import { BalanceResource } from './service-groups/portfolio/balance-resource.ts'
import { ClientResource } from './service-groups/portfolio/client-resource.ts'
import { ClosedPositionResource } from './service-groups/portfolio/closed-position-resource.ts'
import { ExposureResource } from './service-groups/portfolio/exposure-resource.ts'
import { NetPositionResource } from './service-groups/portfolio/net-position-resource.ts'
import { OrderResource } from './service-groups/portfolio/order-resource.ts'
import { PositionResource } from './service-groups/portfolio/position-resource.ts'
import { UserResource } from './service-groups/portfolio/user-resource.ts'
import { ReferenceData } from './service-groups/reference-data.ts'

export class SaxoBankClient {
  readonly #httpClient: HTTPClient

  readonly chart: ChartResource

  readonly portfolio: {
    readonly accountGroups: AccountGroupResource
    readonly account: AccountResource
    readonly balance: BalanceResource
    readonly client: ClientResource
    readonly closedPosition: ClosedPositionResource
    readonly exposure: ExposureResource
    readonly netPosition: NetPositionResource
    readonly order: OrderResource
    readonly position: PositionResource
    readonly user: UserResource
  }

  readonly referenceData: ReferenceData

  constructor({
    authorization,
    prefixURL = Environment['SAXOBANK_API_PREFIX_URL'] ?? 'https://gateway.saxobank.com/sim/openapi',
  }: {
    readonly authorization: SaxoBankAuthorization
    readonly prefixURL?: undefined | string
  }) {
    if (prefixURL === undefined) {
      throw new Error('No prefix URL provided')
    }

    this.#httpClient = HTTPClient.withAuthorization(authorization)

    const resourceClient = new ResourceClient({
      client: this.#httpClient,
      prefixURL,
    })

    this.chart = new ChartResource({ client: this.#httpClient, prefixURL })

    this.portfolio = {
      accountGroups: new AccountGroupResource({ client: this.#httpClient, prefixURL }),
      account: new AccountResource({ client: this.#httpClient, prefixURL }),
      balance: new BalanceResource({ client: this.#httpClient, prefixURL }),
      client: new ClientResource({ client: this.#httpClient, prefixURL }),
      closedPosition: new ClosedPositionResource({ client: this.#httpClient, prefixURL }),
      exposure: new ExposureResource({ client: this.#httpClient, prefixURL }),
      netPosition: new NetPositionResource({ client: this.#httpClient, prefixURL }),
      order: new OrderResource({ client: this.#httpClient, prefixURL }),
      position: new PositionResource({ client: this.#httpClient, prefixURL }),
      user: new UserResource({ client: this.#httpClient, prefixURL }),
    }

    this.referenceData = new ReferenceData({ client: resourceClient })
  }
}
