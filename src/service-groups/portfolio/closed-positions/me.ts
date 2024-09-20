import type { ResourceClient } from '../../../resource-client.ts'
import type { ClosedPositionFieldGroup } from '../../../types/derives/closed-position-field-group.ts'
import { ClosedPositionResponse } from '../../../types/records/closed-position-response.ts'

export class Me {
  readonly #client: ResourceClient

  constructor({ client }: { readonly client: ResourceClient }) {
    this.#client = client.appendPath('me')
  }

  /** Returns a list of closed positions fulfilling the criteria specified by the query string parameters. */
  async get(): Promise<ReadonlyArray<ClosedPositionResponse>> {
    const FieldGroups: ClosedPositionFieldGroup[] = [
      'ClosedPosition',
      'ClosedPositionDetails',
      'DisplayAndFormat',
      'ExchangeInfo',
    ]

    return await this.#client.getPaginated({
      searchParams: {
        FieldGroups,
      },
      guard: ClosedPositionResponse,
    })
  }
}
