import { enums, type GuardType } from 'https://raw.githubusercontent.com/systematic-trader/type-guard/main/mod.ts'

export type ClientPositionNettingMode = GuardType<typeof ClientPositionNettingMode>

export const ClientPositionNettingMode = enums([
  /** Default EndOfDay netting mode. */
  'EndOfDay',

  /** Intraday netting mode. */
  'Intraday',
])
