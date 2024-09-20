import type { ResourceClient } from '../../resource-client.ts'
import { Me } from './orders/me.ts'

export class Orders {
  readonly me: Me

  constructor({ client }: { readonly client: ResourceClient }) {
    const resourceClient = client.appendPath('v1/orders')

    this.me = new Me({ client: resourceClient })
  }
}
