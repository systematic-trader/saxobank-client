import type { ServiceGroupClient } from '../service-group-client.ts'
import { InfoPrices } from './trade/info-prices.ts'
import { Orders } from './trade/orders.ts'
import { Positions } from './trade/positions.ts'

export class Trade {
  readonly orders: Orders
  readonly positions: Positions
  readonly infoPrices: InfoPrices

  constructor({ client }: { readonly client: ServiceGroupClient }) {
    const serviceGroupClient = client.appendPath('trade')

    this.orders = new Orders({ client: serviceGroupClient })
    this.positions = new Positions({ client: serviceGroupClient })
    this.infoPrices = new InfoPrices({ client: serviceGroupClient })
  }
}
