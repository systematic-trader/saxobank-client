import type { ResourceClient } from '../../resource-client.ts'
import { Me } from './accounts/me.ts'

export class Accounts {
  readonly me: Me

  constructor({ client }: { readonly client: ResourceClient }) {
    const resourceClient = client.appendPath('v1/accounts')

    this.me = new Me({ client: resourceClient })
  }
}
