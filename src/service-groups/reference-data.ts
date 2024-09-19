import type { ResourceClient } from '../resource-client.ts'
import { Instruments } from './reference-data/instruments.ts'

export class ReferenceData {
  readonly instruments: Instruments

  constructor({ client }: { readonly client: ResourceClient }) {
    const referenceDataClient = client.appendPath('ref')

    this.instruments = new Instruments({ client: referenceDataClient })
  }
}
