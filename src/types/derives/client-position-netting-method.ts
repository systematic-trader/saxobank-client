import { enums, type GuardType } from 'https://raw.githubusercontent.com/systematic-trader/type-guard/main/mod.ts'

export type ClientPositionNettingMethod = GuardType<typeof ClientPositionNettingMethod>

export const ClientPositionNettingMethod = enums([
  /** Average Netting Method */
  'Average',

  /** FIFO Netting Method */
  'FIFO',
])
