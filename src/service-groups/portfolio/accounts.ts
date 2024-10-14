import type { ServiceGroupClient } from '../../service-group-client.ts'
import { Me } from './accounts/me.ts'

export class Accounts {
  readonly me: Me

  constructor({ client }: { readonly client: ServiceGroupClient }) {
    const serviceGroupClient = client.appendPath('v1/accounts')

    this.me = new Me({ client: serviceGroupClient })
  }
}
