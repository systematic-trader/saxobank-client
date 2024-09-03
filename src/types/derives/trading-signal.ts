import { enums, type GuardType } from 'https://raw.githubusercontent.com/systematic-trader/type-guard/main/mod.ts'

export type TradingSignal = GuardType<typeof TradingSignal>

export const TradingSignal = enums(['Allowed', 'NotAllowed'])
