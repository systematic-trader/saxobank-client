import { array, props, string } from 'https://raw.githubusercontent.com/systematic-trader/type-guard/main/mod.ts'
import { HTTPClientError } from '../../../http-client.ts'
import type { ResourceClient } from '../../../resource-client.ts'
import { FuturesSpaceElement } from '../../../types/records/futures-space-element.ts'

const ResponseBodyGuard = props({
  /** The base id of the futures space. */
  BaseIdentifier: string(),
  /** The elements of the futures space. */
  Elements: array(FuturesSpaceElement),
})

export class ContractFuturesSpaces {
  readonly #client: ResourceClient

  constructor({ client }: { readonly client: ResourceClient }) {
    this.#client = client.appendPath('futuresspaces')
  }

  async get({ Uic }: { readonly Uic: number }): Promise<ReadonlyArray<FuturesSpaceElement>> {
    try {
      const responseBody = await this.#client.get({
        path: String(Uic),
        guard: ResponseBodyGuard,
      })

      return responseBody.Elements
    } catch (error) {
      if (error instanceof HTTPClientError && error.statusCode === 404) {
        return []
      }

      throw error
    }
  }
}
