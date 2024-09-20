import type { ResourceClient } from '../../resource-client.ts'
import { Me } from './closed-positions/me.ts'

export class ClosedPositions {
  readonly me: Me

  constructor({ client }: { readonly client: ResourceClient }) {
    const resourceClient = client.appendPath('v1/closedpositions')

    this.me = new Me({ client: resourceClient })
  }
}
