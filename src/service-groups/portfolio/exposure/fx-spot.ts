import type { ResourceClient } from '../../../resource-client.ts'
import { Me } from './currency/me.ts'

export class FXSpot {
  readonly me: Me

  constructor({ client }: { readonly client: ResourceClient }) {
    const resourceClient = client.appendPath('fxspot')

    this.me = new Me({ client: resourceClient })
  }
}
