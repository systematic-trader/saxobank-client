import type { ResourceClient } from '../resource-client.ts'
import { AccountGroups } from './portfolio/account-groups.ts'
import { Accounts } from './portfolio/accounts.ts'
import { Balances } from './portfolio/balances.ts'
import { Clients } from './portfolio/clients.ts'
import { ClosedPositions } from './portfolio/closed-positions.ts'
import { Exposure } from './portfolio/exposure.ts'
import { NetPositions } from './portfolio/net-positions.ts'
import { Orders } from './portfolio/orders.ts'
import { Positions } from './portfolio/positions.ts'
import { Users } from './portfolio/users.ts'

export class Portfolio {
  readonly accountGroups: AccountGroups
  readonly accounts: Accounts
  readonly balances: Balances
  readonly clients: Clients
  readonly closedPositions: ClosedPositions
  readonly exposure: Exposure
  readonly netPositions: NetPositions
  readonly orders: Orders
  readonly positions: Positions
  readonly users: Users

  constructor({ client }: { readonly client: ResourceClient }) {
    const resourceClient = client.appendPath('port')

    this.accountGroups = new AccountGroups({ client: resourceClient })
    this.accounts = new Accounts({ client: resourceClient })
    this.balances = new Balances({ client: resourceClient })
    this.clients = new Clients({ client: resourceClient })
    this.closedPositions = new ClosedPositions({ client: resourceClient })
    this.exposure = new Exposure({ client: resourceClient })
    this.netPositions = new NetPositions({ client: resourceClient })
    this.orders = new Orders({ client: resourceClient })
    this.positions = new Positions({ client: resourceClient })
    this.users = new Users({ client: resourceClient })
  }
}
