import type { ResourceClient } from '../resource-client.ts'
import { InfoPrices } from './trade/info-prices.ts'
import { Positions } from './trade/positions.ts'

export class Trade {
  readonly positions: Positions
  readonly infoPrices: InfoPrices

  constructor({ client }: { readonly client: ResourceClient }) {
    const resourceClient = client.appendPath('trade')

    this.positions = new Positions({ client: resourceClient })
    this.infoPrices = new InfoPrices({ client: resourceClient })
  }
}
