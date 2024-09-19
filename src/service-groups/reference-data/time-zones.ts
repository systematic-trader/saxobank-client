import type { ResourceClient } from '../../resource-client.ts'
import { TimeZoneDetails } from '../../types/records/time-zone-details.ts'

export class TimeZones {
  readonly #client: ResourceClient

  constructor({ client }: { readonly client: ResourceClient }) {
    this.#client = client.appendPath('v1/timezones')
  }

  async get(): Promise<ReadonlyArray<TimeZoneDetails>> {
    return await this.#client.getPaginated({ guard: TimeZoneDetails })
  }
}
