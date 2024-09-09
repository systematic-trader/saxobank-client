import { enums, type GuardType } from 'https://raw.githubusercontent.com/systematic-trader/type-guard/main/mod.ts'

export type SettlementStyle = GuardType<typeof SettlementStyle>

export const SettlementStyle = enums([
  /** The contract option is settled as cash. */
  'CashDelivery',

  /** The contract option is settled by physical delivery. */
  'PhysicalDelivery',
])
