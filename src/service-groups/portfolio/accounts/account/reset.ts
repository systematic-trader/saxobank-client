import type { ResourceClient } from '../../../../resource-client.ts'

export class Reset {
  readonly #client: ResourceClient

  constructor({ client }: { readonly client: ResourceClient }) {
    this.#client = client
  }

  /**
   * Resets a trial account.
   * Cannot be used in live environment.
   */
  async put({ AccountKey, NewBalance }: {
    readonly AccountKey: string
    readonly NewBalance: number
  }): Promise<void> {
    return await this.#client.put({
      body: {
        NewBalance,
      },
      path: [AccountKey, 'reset'].join('/'),
    })
  }
}
