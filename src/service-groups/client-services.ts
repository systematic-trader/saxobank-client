import type { ServiceGroupClient } from '../service-group-client.ts'
import { TradingConditions } from './client-services/trading-conditions.ts'

export class ClientServices {
  readonly tradingConditions: TradingConditions

  constructor({ client }: { readonly client: ServiceGroupClient }) {
    const serviceGroupClient = client.appendPath('cs')

    this.tradingConditions = new TradingConditions({ client: serviceGroupClient })
  }
}
