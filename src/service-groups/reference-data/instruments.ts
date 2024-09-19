import type { ResourceClient } from '../../resource-client.ts'

import { InstrumentsDetails } from './instruments/details.ts'

export class Instruments {
  readonly details: InstrumentsDetails

  constructor({ client }: { readonly client: ResourceClient }) {
    const resourceClient = client.appendPath('v1/instruments')

    this.details = new InstrumentsDetails({ client: resourceClient })
  }
}
