import {
  type GuardType,
  props,
  record,
  string,
} from 'https://raw.githubusercontent.com/systematic-trader/type-guard/main/mod.ts'

const SaxobankAppKey = string({ blank: false })

export const SessionFileContent = record(
  SaxobankAppKey,
  props({
    accessToken: string({ blank: false }),
    accessTokenExpiresAt: string({ format: 'date-iso8601' }),
    refreshToken: string({ blank: false }),
    refreshTokenExpiresAt: string({ format: 'date-iso8601' }),
  }),
)

export interface SessionFileContent extends GuardType<typeof SessionFileContent> {}
