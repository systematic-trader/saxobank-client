import {
  boolean,
  type GuardType,
  number,
  props,
} from 'https://raw.githubusercontent.com/systematic-trader/type-guard/main/mod.ts'
import { OrderDistanceType } from '../derives/order-distance-type.ts'
import { PlaceableOrderType } from '../derives/placeable-order-type.ts'

export type OrderDistances = GuardType<typeof OrderDistances>

export const OrderDistances = props({
  EntryDefaultDistance: number(),
  EntryDefaultDistanceType: OrderDistanceType,
  LimitDefaultDistance: number(),
  LimitDefaultDistanceType: OrderDistanceType,
  StopLimitDefaultDistance: number(),
  StopLimitDefaultDistanceType: OrderDistanceType,
  StopLossDefaultDistance: number(),
  StopLossDefaultDistanceType: OrderDistanceType,
  StopLossDefaultEnabled: boolean(),
  StopLossDefaultOrderType: PlaceableOrderType,
  TakeProfitDefaultDistance: number(),
  TakeProfitDefaultDistanceType: OrderDistanceType,
  TakeProfitDefaultEnabled: boolean(),
})
