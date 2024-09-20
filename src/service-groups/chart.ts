import type { ResourceClient } from '../resource-client.ts'
import { Charts } from './chart/charts.ts'

export class Chart {
  readonly charts: Charts

  constructor({ client }: { readonly client: ResourceClient }) {
    const resourceClient = client.appendPath('chart')

    this.charts = new Charts({ client: resourceClient })
  }
}
