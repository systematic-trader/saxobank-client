import type { HTTPClient } from '../../http-client.ts'
import type { OrderFieldGroup } from '../../types/derives/order-field-group.ts'
import type { OrderStatusFilter } from '../../types/derives/order-status-filter.ts'
import { OrderResponse } from '../../types/records/order-response.ts'
import { fetchResourceData } from '../fetch-resource-data.ts'
import { urlJoin } from '../utils.ts'

/** Read only end points serving orders. */
export class OrderResource {
  readonly #client: HTTPClient
  readonly #resourceURL: URL

  constructor({
    client,
    prefixURL,
  }: {
    readonly client: HTTPClient
    readonly prefixURL: string
  }) {
    this.#client = client
    this.#resourceURL = urlJoin(prefixURL, 'port', 'v1', 'orders')
  }

  me({ skip, top, fieldGroups, multiLegOrderId, status }: {
    readonly skip?: undefined | number
    readonly top?: undefined | number
    readonly fieldGroups: readonly OrderFieldGroup[]
    readonly multiLegOrderId?: undefined | string
    readonly status?: undefined | OrderStatusFilter
  }): Promise<ReadonlyArray<OrderResponse>> {
    const url = urlJoin(this.#resourceURL, 'me')

    if (skip !== undefined) {
      url.searchParams.set('$skip', skip.toString())
    }

    if (top !== undefined) {
      url.searchParams.set('$top', top.toString())
    }

    url.searchParams.set('FieldGroups', fieldGroups.join(','))

    if (multiLegOrderId !== undefined) {
      url.searchParams.set('MultiLegOrderId', multiLegOrderId)
    }

    if (status !== undefined) {
      url.searchParams.set('Status', status)
    }

    return fetchResourceData({
      client: this.#client,
      url,
      guard: OrderResponse,
    })
  }
}
