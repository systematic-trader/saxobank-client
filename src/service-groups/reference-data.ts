import type { ResourceClient } from '../resource-client.ts'
import { AlgoStrategies } from './reference-data/algostrategies.ts'
import { Countries } from './reference-data/countries.ts'
import { Instruments } from './reference-data/instruments.ts'

export class ReferenceData {
  readonly algostrategies: AlgoStrategies
  readonly countries: Countries
  readonly instruments: Instruments

  constructor({ client }: { readonly client: ResourceClient }) {
    const resourceClient = client.appendPath('ref')

    this.algostrategies = new AlgoStrategies({ client: resourceClient })
    this.countries = new Countries({ client: resourceClient })
    this.instruments = new Instruments({ client: resourceClient })
  }
}
