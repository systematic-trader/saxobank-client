import type { SaxoBankAuthorization } from './authentication/saxobank-authentication.ts'
import { Environment } from './environment.ts'
import { HTTPClient } from './http-client.ts'
import { ResourceClient } from './resource-client.ts'
import { Chart } from './service-groups/chart.ts'
import { ClientServices } from './service-groups/client-services.ts'
import { Portfolio } from './service-groups/portfolio.ts'
import { ReferenceData } from './service-groups/reference-data.ts'
import { Trade } from './service-groups/trade.ts'

export class SaxoBankClient {
  readonly #httpClient: HTTPClient

  readonly chart: Chart
  readonly clientServices: ClientServices
  readonly portfolio: Portfolio
  readonly referenceData: ReferenceData
  readonly trade: Trade

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

    this.chart = new Chart({ client: resourceClient })
    this.clientServices = new ClientServices({ client: resourceClient })
    this.portfolio = new Portfolio({ client: resourceClient })
    this.referenceData = new ReferenceData({ client: resourceClient })
    this.trade = new Trade({ client: resourceClient })
  }
}
