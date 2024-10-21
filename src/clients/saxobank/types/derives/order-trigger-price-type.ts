import { enums, type GuardType } from 'https://raw.githubusercontent.com/systematic-trader/type-guard/main/mod.ts'

export type OrderTriggerPriceType = GuardType<typeof OrderTriggerPriceType>

export const OrderTriggerPriceType = enums(['LastTraded', 'Open', 'Close'])
