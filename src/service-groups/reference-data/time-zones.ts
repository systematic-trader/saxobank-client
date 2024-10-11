import type { ServiceGroupClient } from '../../service-group-client.ts'
import { TimeZoneDetails } from '../../types/records/time-zone-details.ts'

export class TimeZones {
  readonly #client: ServiceGroupClient

  constructor({ client }: { readonly client: ServiceGroupClient }) {
    this.#client = client.appendPath('v1/timezones')
  }

  async get(): Promise<ReadonlyArray<TimeZoneDetails>> {
    return await this.#client.getPaginated({ guard: TimeZoneDetails })
  }
}
