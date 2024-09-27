import type { ResourceClient } from '../resource-client.ts'
import { Positions } from './trade/positions.ts'

export class Trade {
  readonly positions: Positions

  constructor({ client }: { readonly client: ResourceClient }) {
    const resourceClient = client.appendPath('trade')

    this.positions = new Positions({ client: resourceClient })
  }
}
