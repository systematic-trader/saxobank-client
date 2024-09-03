import { enums, type GuardType } from 'https://raw.githubusercontent.com/systematic-trader/type-guard/main/mod.ts'

export type PriceDisplayFormatType = GuardType<typeof PriceDisplayFormatType>

export const PriceDisplayFormatType = enums([
  /**
   * Display the last digit as a smaller than the rest of the numbers. Note that this digit is not included in the number of decimals, effectively increasing the number of decimals by one. E.g. 12.345 when Decimals is 2 and DisplayFormat is AllowDecimalPips.
   */
  'AllowDecimalPips',
  /** Display the last two digits as a smaller than the rest of the numbers. */
  'AllowTwoDecimalPips',
  /** Display as regular fraction i.e. 3 1/4 The Decimals field indicates the fraction demoninator as 1/(2^x). So if Decimals is 2, the value should represent the number of 1/4'ths. */
  'Fractions',
  /** Display as modern faction, e.g. 1’07.5. The Decimals field indicates the fraction demoninator as 1/(2^x). So if Decimals is 5, the value should represent the number of 1/32'ths */
  'ModernFractions',
  /** Standard decimal formatting is used with the Decimals field indicating the number of decimals. */
  'Normal',
  /** Display as percentage, e.g. 12.34%. The Decimals field indicates the number of decimals to show. */
  'Percentage',
])
