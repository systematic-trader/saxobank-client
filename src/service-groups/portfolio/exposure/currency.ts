import type { ResourceClient } from '../../../resource-client.ts'
import { Me } from './currency/me.ts'

export class Currency {
  readonly me: Me

  constructor({ client }: { readonly client: ResourceClient }) {
    const resourceClient = client.appendPath('currency')

    this.me = new Me({ client: resourceClient })
  }
}
