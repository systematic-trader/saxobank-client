import { enums, type GuardType } from 'https://raw.githubusercontent.com/systematic-trader/type-guard/main/mod.ts'

export type SettlementType = GuardType<typeof SettlementType>

export const SettlementType = enums([
  /** Full Roll over. Delete instructions and revert to default SRD behaviour */
  'FullRollover',

  /** FullSettlement. Ignore amount and settle all */
  'FullSettlement',

  /** Default / Partial settlement method. Use the amount for settlement */
  'PartialSettlement',
])
