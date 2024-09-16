import {
  type GuardType,
  props,
  string,
} from 'https://raw.githubusercontent.com/systematic-trader/type-guard/main/mod.ts'

export const CodeResponse = props({
  code: string({ blank: false }),
  state: string({ blank: false }),
})

export interface CodeResponse extends GuardType<typeof CodeResponse> {}
