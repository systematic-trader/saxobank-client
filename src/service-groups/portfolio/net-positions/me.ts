import type { ServiceGroupClient } from '../../../service-group-client.ts'
import type { NetPositionFieldGroup } from '../../../types/derives/net-position-field-group.ts'
import { NetPositionResponse } from '../../../types/records/net-position-response.ts'

export class Me {
  readonly #client: ServiceGroupClient

  constructor({ client }: { readonly client: ServiceGroupClient }) {
    this.#client = client.appendPath('me')
  }

  /**
   * Returns a list of net positions fulfilling the criteria specified by the query string parameters.
   * Each net position may include all related sub positions if fieldGroups includes SubPositions.
   */
  async get(): Promise<ReadonlyArray<NetPositionResponse>> {
    const FieldGroups: NetPositionFieldGroup[] = [
      'DisplayAndFormat',
      'ExchangeInfo',
      'Greeks',
      'NetPositionBase',
      'NetPositionView',
    ]

    return await this.#client.getPaginated({
      searchParams: {
        FieldGroups,
      },
      guard: NetPositionResponse,
    })
  }
}
