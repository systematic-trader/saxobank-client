import {
  format,
  type GuardType,
  integer,
  props,
} from 'https://raw.githubusercontent.com/systematic-trader/type-guard/main/mod.ts'
import { TenorUnit } from '../derives/tenor-unit.ts'

export interface StandardDate extends GuardType<typeof StandardDate> {}

export const StandardDate = props({
  /** The standard date */
  Date: format('gregorian-date'),
  Unit: TenorUnit,
  Value: integer(),
})
