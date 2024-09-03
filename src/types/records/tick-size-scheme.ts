import {
  array,
  type GuardType,
  number,
  props,
} from 'https://raw.githubusercontent.com/systematic-trader/type-guard/main/mod.ts'
import { TickSizeSchemeElement } from './tick-size-scheme-element.ts'

export interface TickSizeScheme extends GuardType<typeof TickSizeScheme> {}

export const TickSizeScheme = props({
  DefaultTickSize: number(),
  Elements: array(TickSizeSchemeElement),
})
