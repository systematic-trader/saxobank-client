import {
  type GuardType,
  integer,
  literal,
  props,
  string,
} from 'https://raw.githubusercontent.com/systematic-trader/type-guard/main/mod.ts'

export const TokensResponse = props({
  access_token: string(),
  token_type: literal('Bearer'),
  expires_in: integer(),
  refresh_token: string(),
  refresh_token_expires_in: integer(),
  base_uri: literal(null),
})

export interface TokensResponse extends GuardType<typeof TokensResponse> {}
