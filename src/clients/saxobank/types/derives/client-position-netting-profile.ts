import { enums, type GuardType } from 'https://raw.githubusercontent.com/systematic-trader/type-guard/main/mod.ts'

export type ClientPositionNettingProfile = GuardType<typeof ClientPositionNettingProfile>

export const ClientPositionNettingProfile = enums([
  /** AverageRealTime netting profile */
  'AverageRealTime',

  /** FifoEndOfDay netting profile */
  'FifoEndOfDay',

  /** FifoRealTime netting profile */
  'FifoRealTime',
])
