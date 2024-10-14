import { enums, type GuardType } from 'https://raw.githubusercontent.com/systematic-trader/type-guard/main/mod.ts'

export type OpenOrderRelation = GuardType<typeof OpenOrderRelation>

export const OpenOrderRelation = enums([
  /**
   * If done master.
   * Relation between two or three orders.
   * The slave orders are released only if the master order is filled.
   */
  'IfDoneMaster',

  /**
   * If done slave.
   * Relation between two orders.
   * The other is always IfDoneMaster.
   */
  'IfDoneSlave',

  /**
   * If done slave OCO.
   * Relation between three orders.
   * One is always IfDoneMaster and the other is always also IfDoneSlaveOCO.
   * The OCO relation is between the two slave orders.
   */
  'IfDoneSlaveOco',

  /**
   * One cancels other.
   * Relation between two orders.
   * When one is filled, the other is cancelled.
   */
  'Oco',

  /**
   * Standalone.
   * No relations to other orders.
   */
  'StandAlone',
])
