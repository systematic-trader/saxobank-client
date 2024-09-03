import { enums, type GuardType } from 'https://raw.githubusercontent.com/systematic-trader/type-guard/main/mod.ts'

export type LoginStatus = GuardType<typeof LoginStatus>

export const LoginStatus = enums([
  /** The user logged in */
  'Successful',

  /** The user recieved an access denied */
  'Unsuccessful',
])
