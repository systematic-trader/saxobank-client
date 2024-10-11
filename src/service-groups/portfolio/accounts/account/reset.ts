import type { ServiceGroupClient } from '../../../../service-group-client.ts'

export class Reset {
  readonly #client: ServiceGroupClient

  constructor({ client }: { readonly client: ServiceGroupClient }) {
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
