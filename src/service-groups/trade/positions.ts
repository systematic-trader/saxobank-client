import type { ResourceClient } from '../../resource-client.ts'

export class Positions {
  constructor({ client }: { readonly client: ResourceClient }) {
    client.appendPath('v1/positions')
  }
}
