import type { ResourceClient } from '../../resource-client.ts'
import { ForwardTenor } from './standard-dates/forward-tenor.ts'
import { FxOptionExpiry } from './standard-dates/fx-option-expiry.ts'

export class StandardDates {
  readonly forwardTenor: ForwardTenor
  readonly fxOptionExpiry: FxOptionExpiry

  constructor({ client }: { readonly client: ResourceClient }) {
    const resourceClient = client.appendPath('v1/standarddates')

    this.forwardTenor = new ForwardTenor({ client: resourceClient })
    this.fxOptionExpiry = new FxOptionExpiry({ client: resourceClient })
  }
}
