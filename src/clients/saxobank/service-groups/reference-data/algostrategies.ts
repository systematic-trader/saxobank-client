import type { ServiceGroupClient } from '../../service-group-client.ts'
import { Strategy } from '../../types/records/strategy.ts'

export class AlgoStrategies {
  readonly #client: ServiceGroupClient

  constructor({ client }: { readonly client: ServiceGroupClient }) {
    this.#client = client.appendPath('v1/algostrategies')
  }

  async get({ name }: { name: string }): Promise<Strategy>
  async get({ name }: { name?: undefined }): Promise<ReadonlyArray<Strategy>>
  async get(): Promise<ReadonlyArray<Strategy>>
  async get({ name }: { name?: undefined | string } = {}): Promise<ReadonlyArray<Strategy> | Strategy> {
    if (name === undefined) {
      return await this.#client.getPaginated({ guard: Strategy })
    }

    return await this.#client.get({ guard: Strategy, path: name })
  }
}
