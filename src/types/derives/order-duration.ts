import {
  boolean,
  type GuardType,
  optional,
  props,
  string,
} from 'https://raw.githubusercontent.com/systematic-trader/type-guard/main/mod.ts'
import { OrderDurationType } from './order-duration-type.ts'

export interface OrderDuration extends GuardType<typeof OrderDuration> {}

export const OrderDuration = props({
  /** Order duration type. Defines the time period during which an order is valid. If the period expires (for instance for a DayOrder or GoodTillDate order), the order is cancelled automatically. */
  DurationType: OrderDurationType,

  /** Indicates whether the ExpirationDateTime field contains the time alongside a date. Only applicable for GoodTillDate OrderDurationType. */
  ExpirationDateContainsTime: optional(boolean()),

  /**
   * Expiration date and (optionally) time if the order duration type is GoodTillDate.
   * If no time is provided, orders are cancelled at the end of the trading day during overnight processing.
   * Note: the time value of this field (if provided) is always expressed in the timezone of the exchange on which the instrument is traded.
   * The time value only supports hours and minutes formatted as HH:MM. For instance, a 15:00 expiration time for an instrument traded on NYSE will be cancelled automatically at 3pm local time (NY) if the order is not triggered before this time. */
  ExpirationDateTime: optional(string({ format: 'date-iso8601' })),
})
