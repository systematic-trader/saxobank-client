import { enums, type GuardType } from 'https://raw.githubusercontent.com/systematic-trader/type-guard/main/mod.ts'

export type DistributionPolicy = GuardType<typeof DistributionPolicy>

export const DistributionPolicy = enums([
  /** Distribution Policy is Accumulating */
  'Accumulating',

  /** Distribution Policy is Income */
  'Income',
])
