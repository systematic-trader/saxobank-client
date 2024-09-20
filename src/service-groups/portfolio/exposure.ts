import type { ResourceClient } from '../../resource-client.ts'
import { Currency } from './exposure/currency.ts'
import { FXSpot } from './exposure/fx-spot.ts'
import { Instruments } from './exposure/instruments.ts'

export class Exposure {
  readonly currency: Currency
  readonly fxSpot: FXSpot
  readonly instruments: Instruments

  constructor({ client }: { readonly client: ResourceClient }) {
    const resourceClient = client.appendPath('v1/exposure')

    this.currency = new Currency({ client: resourceClient })
    this.fxSpot = new FXSpot({ client: resourceClient })
    this.instruments = new Instruments({ client: resourceClient })
  }
}
