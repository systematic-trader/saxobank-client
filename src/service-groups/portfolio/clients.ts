import type { ResourceClient } from '../../resource-client.ts'
import { Me } from './clients/me.ts'

export class Clients {
  readonly me: Me

  constructor({ client }: { readonly client: ResourceClient }) {
    const resourceClient = client.appendPath('v1/clients')

    this.me = new Me({ client: resourceClient })
  }
}
