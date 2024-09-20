import type { ResourceClient } from '../../resource-client.ts'
import { Strategy } from '../../types/records/strategy.ts'

export class AlgoStrategies {
  readonly #client: ResourceClient

  constructor({ client }: { readonly client: ResourceClient }) {
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
