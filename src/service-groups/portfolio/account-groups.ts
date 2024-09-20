import type { ResourceClient } from '../../resource-client.ts'
import { AccountGroup } from './account-groups/account-group.ts'
import { Me } from './account-groups/me.ts'

export class AccountGroups {
  readonly me: Me
  readonly accountGroup: AccountGroup

  constructor({ client }: { readonly client: ResourceClient }) {
    const resourceClient = client.appendPath('v1/accountgroups')

    this.me = new Me({ client: resourceClient })
    this.accountGroup = new AccountGroup({ client: resourceClient })
  }
}
