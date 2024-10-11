import type { ServiceGroupClient } from '../service-group-client.ts'
import { Charts } from './chart/charts.ts'

export class Chart {
  readonly charts: Charts

  constructor({ client }: { readonly client: ServiceGroupClient }) {
    const serviceGroupClient = client.appendPath('chart')

    this.charts = new Charts({ client: serviceGroupClient })
  }
}
