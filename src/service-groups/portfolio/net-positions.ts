import type { ResourceClient } from '../../resource-client.ts'
import { Me } from './net-positions/me.ts'

export class NetPositions {
  readonly me: Me

  constructor({ client }: { readonly client: ResourceClient }) {
    const resourceClient = client.appendPath('v1/netpositions')

    this.me = new Me({ client: resourceClient })
  }
}
