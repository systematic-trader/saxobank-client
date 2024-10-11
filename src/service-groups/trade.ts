import type { ServiceGroupClient } from '../service-group-client.ts'
import { InfoPrices } from './trade/info-prices.ts'
import { Positions } from './trade/positions.ts'

export class Trade {
  readonly positions: Positions
  readonly infoPrices: InfoPrices

  constructor({ client }: { readonly client: ServiceGroupClient }) {
    const serviceGroupClient = client.appendPath('trade')

    this.positions = new Positions({ client: serviceGroupClient })
    this.infoPrices = new InfoPrices({ client: serviceGroupClient })
  }
}
