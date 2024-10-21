import { enums, type GuardType } from 'https://raw.githubusercontent.com/systematic-trader/type-guard/main/mod.ts'

export const DefaultSlippageType = enums(['Percentage', 'Pips', 'Ticks'])

export type DefaultSlippageType = GuardType<typeof DefaultSlippageType>
