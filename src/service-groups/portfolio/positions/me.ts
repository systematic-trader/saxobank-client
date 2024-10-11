import type { ServiceGroupClient } from '../../../service-group-client.ts'
import type { PositionFieldGroup } from '../../../types/derives/position-field-group.ts'
import { PositionResponse } from '../../../types/records/position-response.ts'

export class Me {
  readonly #client: ServiceGroupClient

  constructor({ client }: { readonly client: ServiceGroupClient }) {
    this.#client = client.appendPath('me')
  }

  async get(): Promise<Array<PositionResponse>> {
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
