import { enums, type GuardType } from 'https://raw.githubusercontent.com/systematic-trader/type-guard/main/mod.ts'

export type DaysType = GuardType<typeof DaysType>

export const DaysType = enums([
  /** All days */
  'AllDays',

  /** Only working Days */
  'WorkingDays',
])
