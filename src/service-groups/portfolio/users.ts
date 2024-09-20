import type { ResourceClient } from '../../resource-client.ts'
import { Me } from './users/me.ts'

export class Users {
  readonly me: Me

  constructor({ client }: { readonly client: ResourceClient }) {
    const resourceClient = client.appendPath('v1/users')

    this.me = new Me({ client: resourceClient })
  }
}
