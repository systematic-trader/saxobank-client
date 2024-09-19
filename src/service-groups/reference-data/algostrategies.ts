import type { ResourceClient } from '../../resource-client.ts'
import { Strategy } from '../../types/records/strategy.ts'

export class AlgoStrategies {
  readonly #client: ResourceClient

  constructor({ client }: { readonly client: ResourceClient }) {
    this.#client = client.appendPath('v1/algostrategies')
  }

  async get(): Promise<ReadonlyArray<Strategy>> {
    return await this.#client.getPaginated({ guard: Strategy })
  }
}
