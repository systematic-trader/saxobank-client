import { enums, type GuardType } from 'https://raw.githubusercontent.com/systematic-trader/type-guard/main/mod.ts'

export type ClientContractType = GuardType<typeof ClientContractType>

export const ClientContractType = enums([
  /** Joint account */
  'JointAccount',
])
