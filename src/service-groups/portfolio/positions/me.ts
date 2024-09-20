import type { ResourceClient } from '../../../resource-client.ts'
import type { PositionFieldGroup } from '../../../types/derives/position-field-group.ts'
import { PositionResponse } from '../../../types/records/position-response.ts'

export class Me {
  readonly #client: ResourceClient

  constructor({ client }: { readonly client: ResourceClient }) {
    this.#client = client.appendPath('me')
  }

  async get(): Promise<ReadonlyArray<PositionResponse>> {
    const FieldGroups: PositionFieldGroup[] = [
      'Costs',
      'DisplayAndFormat',
      'ExchangeInfo',
      'Greeks',
      'PositionBase',
      'PositionIdOnly',
      'PositionView',
    ]

    return await this.#client.getPaginated({
      searchParams: {
        FieldGroups,
      },
      guard: PositionResponse,
    })
  }
}
