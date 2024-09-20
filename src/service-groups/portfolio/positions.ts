import type { ResourceClient } from '../../resource-client.ts'
import { Me } from './positions/me.ts'

export class Positions {
  readonly me: Me

  constructor({ client }: { readonly client: ResourceClient }) {
    const resourceClient = client.appendPath('v1/positions')

    this.me = new Me({ client: resourceClient })
  }
}
