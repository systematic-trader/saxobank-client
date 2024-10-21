import { enums, type GuardType } from 'https://raw.githubusercontent.com/systematic-trader/type-guard/main/mod.ts'

export type BondsCouponType = GuardType<typeof BondsCouponType>

export const BondsCouponType = enums(['Fixed', 'None', 'Other', 'Variable'])
