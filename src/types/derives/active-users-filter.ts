import { enums, type GuardType } from 'https://raw.githubusercontent.com/systematic-trader/type-guard/main/mod.ts'

export type ActiveUsersFilter = GuardType<typeof ActiveUsersFilter>

export const ActiveUsersFilter = enums([
  /** Active users */
  'Active',

  /** Active and inactive users */
  'All',

  /** Inactive users */
  'Inactive',
])
