import { decode } from 'https://deno.land/x/djwt@v3.0.2/mod.ts'
import { assertReturn } from 'https://raw.githubusercontent.com/systematic-trader/type-guard/main/mod.ts'
import { HTTPClient } from '../http-client.ts'
import { urlJoin } from '../utils.ts'
import { SessionFileContent } from './types/session-file-content.ts'
import { TokensResponse } from './types/tokens-response.ts'

// todo in the future, we should consider moving this file out from this repository - maybe into the user's home directory
const PERSISTED_SESSION_FILE_NAME = 'saxobank-session.json'

async function readSessionsFile(): Promise<SessionFileContent> {
  const fileContent = await Deno.readFile(PERSISTED_SESSION_FILE_NAME).catch((error) => {
    if (error instanceof Deno.errors.NotFound) {
      return undefined
    }
  })

  if (fileContent === undefined) {
    return {}
  }

  const fileContentString = new TextDecoder().decode(fileContent)
  return assertReturn(SessionFileContent, JSON.parse(fileContentString))
}

function expirationFromJWT(jwt: string): number {
  const [, payload] = decode<{ readonly exp: string }>(jwt)
  return parseInt(payload.exp, 10)
}

export class SessionTokens {
  readonly accessToken: string
  readonly accessTokenExpiresAt: Date
  readonly refreshToken: string
  readonly refreshTokenExpiresAt: Date

  private constructor({ accessToken, accessTokenExpiresAt, refreshToken, refreshTokenExpiresAt }: {
    readonly accessToken: string
    readonly accessTokenExpiresAt: Date
    readonly refreshToken: string
    readonly refreshTokenExpiresAt: Date
  }) {
    this.accessToken = accessToken
    this.accessTokenExpiresAt = accessTokenExpiresAt
    this.refreshToken = refreshToken
    this.refreshTokenExpiresAt = refreshTokenExpiresAt
  }

  /**
   * Transforms the tokens response from Saxobank into a SessionTokens object
   * This is used when the tokens are initially created and again when they are refreshed
   */
  static #fromTokensResponse(tokensResponse: TokensResponse): SessionTokens {
    const accessToken = tokensResponse.access_token
    const refreshToken = tokensResponse.refresh_token

    const accessTokenExpirationUnix = expirationFromJWT(accessToken) * 1000
    const refreshTokenExpirationDelta = (tokensResponse.refresh_token_expires_in - tokensResponse.expires_in) * 1000
    const refreshTokenExporationUnix = accessTokenExpirationUnix + refreshTokenExpirationDelta

    return new SessionTokens({
      accessToken,
      accessTokenExpiresAt: new Date(accessTokenExpirationUnix),
      refreshToken,
      refreshTokenExpiresAt: new Date(refreshTokenExporationUnix),
    })
  }

  /**
   * Exchanges an authorization code for new session tokens
   *
   * @returns Session tokens
   */
  static async fromAuthorizationCode({ code, appKey, appSecret, oauthURL }: {
    readonly code: string
    readonly appKey: string
    readonly appSecret: string
    readonly oauthURL: string | URL
  }): Promise<SessionTokens> {
    const url = urlJoin(oauthURL, 'token')
    url.searchParams.set('grant_type', 'authorization_code')
    url.searchParams.set('code', code)

    const client = new HTTPClient()

    const tokensResponse = await client.postJSON(url, {
      headers: {
        'Authorization': `Basic ${btoa(`${appKey}:${appSecret}`)}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      guard: TokensResponse,
    })

    return SessionTokens.#fromTokensResponse(tokensResponse)
  }

  /**
   * Creates a new set of session tokens, based on the refresh token.
   * This is commonly referred to as "refreshing the tokens".
   *
   * Previously created session tokens will still be valid until they expire.
   *
   * @returns A new set of session tokens
   */
  static async fromRefreshToken({ refreshToken, appKey, appSecret, oauthURL }: {
    readonly refreshToken: string
    readonly appKey: string
    readonly appSecret: string
    readonly oauthURL: string | URL
  }): Promise<SessionTokens> {
    const url = urlJoin(oauthURL, 'token')
    url.searchParams.set('grant_type', 'refresh_token')
    url.searchParams.set('refresh_token', refreshToken)

    const client = new HTTPClient()

    const response = await client.postJSON(url, {
      headers: {
        'Authorization': `Basic ${btoa(`${appKey}:${appSecret}`)}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      guard: TokensResponse,
    })

    return SessionTokens.#fromTokensResponse(response)
  }

  /**
   * Restore the session tokens from the file system for the given app key
   *
   * @returns The sessions tokens if they exist, otherwise undefined
   */
  static async fromDisk({ appKey }: {
    readonly appKey: string
  }): Promise<undefined | SessionTokens> {
    const sessions = await readSessionsFile()

    const session = sessions[appKey]
    if (session === undefined) {
      return undefined
    }

    return new SessionTokens({
      accessToken: session.accessToken,
      accessTokenExpiresAt: new Date(session.accessTokenExpiresAt),
      refreshToken: session.refreshToken,
      refreshTokenExpiresAt: new Date(session.refreshTokenExpiresAt),
    })
  }

  /**
   * Persists the session tokens for the given app key to the file system
   * Any existing session tokens will be overwritten
   */
  public async saveToDisk({ appKey }: {
    readonly appKey: string
  }): Promise<void> {
    const existingFileContent = await readSessionsFile()

    const fileContent: SessionFileContent = {
      ...existingFileContent,
      [appKey]: {
        accessToken: this.accessToken,
        accessTokenExpiresAt: this.accessTokenExpiresAt.toISOString(),
        refreshToken: this.refreshToken,
        refreshTokenExpiresAt: this.refreshTokenExpiresAt.toISOString(),
      },
    }

    const fileContentJSON = JSON.stringify(fileContent, undefined, 2)
    await Deno.writeFile(PERSISTED_SESSION_FILE_NAME, new TextEncoder().encode(fileContentJSON))
  }

  /**
   * Returns information about the validity of the access and refresh tokens
   * This is relative to the current time, so it will change over time
   */
  get expired(): { readonly accessTokenExpired: boolean; readonly refreshTokenExpired: boolean } {
    const now = Date.now()

    const accessTokenExpired = now >= this.accessTokenExpiresAt.getTime()
    const refreshTokenExpired = now >= this.refreshTokenExpiresAt.getTime()

    if (refreshTokenExpired === true && accessTokenExpired === false) {
      throw new TypeError('Invalid state: Access token is not expired, but refresh token is')
    }

    return { accessTokenExpired, refreshTokenExpired }
  }
}
