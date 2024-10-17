import type { ServiceGroupClient } from '../../service-group-client.ts'
import { Account } from './accounts/account.ts'
import { Me } from './accounts/me.ts'

export class Accounts {
  readonly me: Me
  readonly account: Account

  constructor({ client }: { readonly client: ServiceGroupClient }) {
    const serviceGroupClient = client.appendPath('v1/accounts')

    this.me = new Me({ client: serviceGroupClient })
    this.account = new Account({ client: serviceGroupClient })
  }
}
