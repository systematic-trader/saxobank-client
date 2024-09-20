import type { ResourceClient } from '../../resource-client.ts'
import { Cost } from './trading-conditions/cost.ts'

export class TradingConditions {
  readonly cost: Cost

  constructor({ client }: { readonly client: ResourceClient }) {
    const resourceClient = client.appendPath('v1/tradingconditions')

    this.cost = new Cost({ client: resourceClient })
  }
}
