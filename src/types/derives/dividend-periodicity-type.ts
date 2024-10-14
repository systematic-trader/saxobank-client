import { enums, type GuardType } from 'https://raw.githubusercontent.com/systematic-trader/type-guard/main/mod.ts'

export type DividendPeriodicityType = GuardType<typeof DividendPeriodicityType>

// Not documented
export const DividendPeriodicityType = enums([
  /** Bimonthly Periodicity */
  'Bimonthly',

  /** Daily Periodicity */
  'Daily',

  /** Fortnightly Periodicity */
  'Fortnightly',

  /** Four month Periodicity */
  'FourMonth',

  /** Half yearly Periodicity */
  'HalfYearly',

  /** Monthly Periodicity */
  'Monthly',

  /** Quarterly Periodicity */
  'Quarterly',

  /** Weekly Periodicity */
  'Weekly',

  /** Yearly Periodicity */
  'Yearly',
])
