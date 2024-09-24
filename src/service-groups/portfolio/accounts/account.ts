import type { ResourceClient } from '../../../resource-client.ts'
import { Reset } from './account/reset.ts'

export class Account {
  readonly reset: Reset

  constructor({ client }: { readonly client: ResourceClient }) {
    const resourceClient = client

    this.reset = new Reset({ client: resourceClient })
  }
}
