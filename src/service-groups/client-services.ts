import type { ResourceClient } from '../resource-client.ts'
import { TradingConditions } from './client-services/trading-conditions.ts'

export class ClientServices {
  readonly tradingConditions: TradingConditions

  constructor({ client }: { readonly client: ResourceClient }) {
    const resourceClient = client.appendPath('cs')

    this.tradingConditions = new TradingConditions({ client: resourceClient })
  }
}
