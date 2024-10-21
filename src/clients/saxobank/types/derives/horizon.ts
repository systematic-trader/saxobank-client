import { enums, type GuardType } from 'https://raw.githubusercontent.com/systematic-trader/type-guard/main/mod.ts'

export type Horizon = GuardType<typeof Horizon>

export const Horizon = enums([
  /** 1 minute */
  1,

  /** 2 minutes */
  2,

  /** 3 minutes */
  3,

  /** 5 minutes */
  5,

  /** 10 minutes */
  10,

  /** 15 minutes */
  15,

  /** 30 minutes */
  30,

  /** 1 hour */
  60,

  /** 2 hours */
  120,

  /** 3 hours */
  180,

  /** 4 hours */
  240,

  /** 5 hours */
  300,

  /** 6 hours */
  360,

  /** 8 hours */
  480,

  /** 1 day (24 hours) */
  1440,

  /** 1 week (7 days) */
  10080,

  /** 1 month (30 days) */
  43200,

  /** 1 quarter (3 months) */
  129600,

  /** 1 year (4 quarters) */
  518400,
])
