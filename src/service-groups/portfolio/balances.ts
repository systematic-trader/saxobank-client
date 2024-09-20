import type { ResourceClient } from '../../resource-client.ts'
import { Me } from './balances/me.ts'

export class Balances {
  readonly me: Me

  constructor({ client }: { readonly client: ResourceClient }) {
    const resourceClient = client.appendPath('v1/balances')

    this.me = new Me({ client: resourceClient })
  }
}
