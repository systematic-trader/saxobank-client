import type { ResourceClient } from '../resource-client.ts'
import { AlgoStrategies } from './reference-data/algostrategies.ts'
import { Countries } from './reference-data/countries.ts'
import { Cultures } from './reference-data/cultures.ts'
import { Currencies } from './reference-data/currencies.ts'
import { CurrencyPairs } from './reference-data/currency-pairs.ts'
import { Exchanges } from './reference-data/exchanges.ts'
import { Instruments } from './reference-data/instruments.ts'
import { Languages } from './reference-data/languages.ts'
import { StandardDates } from './reference-data/standard-dates.ts'
import { TimeZones } from './reference-data/time-zones.ts'

export class ReferenceData {
  readonly algostrategies: AlgoStrategies
  readonly countries: Countries
  readonly cultures: Cultures
  readonly currencies: Currencies
  readonly currencypairs: CurrencyPairs
  readonly exchanges: Exchanges
  readonly instruments: Instruments
  readonly languages: Languages
  readonly standarddates: StandardDates
  readonly timezones: TimeZones

  constructor({ client }: { readonly client: ResourceClient }) {
    const resourceClient = client.appendPath('ref')

    this.algostrategies = new AlgoStrategies({ client: resourceClient })
    this.countries = new Countries({ client: resourceClient })
    this.cultures = new Cultures({ client: resourceClient })
    this.currencies = new Currencies({ client: resourceClient })
    this.currencypairs = new CurrencyPairs({ client: resourceClient })
    this.exchanges = new Exchanges({ client: resourceClient })
    this.instruments = new Instruments({ client: resourceClient })
    this.languages = new Languages({ client: resourceClient })
    this.standarddates = new StandardDates({ client: resourceClient })
    this.timezones = new TimeZones({ client: resourceClient })
  }
}
