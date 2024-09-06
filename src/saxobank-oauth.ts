import { crypto } from 'https://deno.land/std@0.224.0/crypto/mod.ts'
import { open } from 'https://deno.land/x/open@v0.0.6/index.ts'
import { Environment } from './environment.ts'
import { urlJoin } from './resources/utils.ts'
import {
  assertReturn,
  type GuardType,
  integer,
  literal,
  props,
  string,
} from 'https://raw.githubusercontent.com/systematic-trader/type-guard/main/mod.ts'
import { HTTPClient } from './http-client.ts'
import { decode } from 'https://deno.land/x/djwt@v3.0.2/mod.ts'

const SaxoOauthCodeResponseGuard = props({
  code: string(),
  state: string(),
})

const StateGuard = props({
  csrfToken: string(),
})

const SaxoTokensResponseGuard = props({
  access_token: string(),
  token_type: literal('Bearer'),
  expires_in: integer(),
  refresh_token: string(),
  refresh_token_expires_in: integer(),
  base_uri: literal(null),
})

export interface SaxoTokensResponse extends GuardType<typeof SaxoTokensResponseGuard> {}

function generateCSRFToken(): string {
  return crypto.randomUUID()
}

function createAuthorizationURL({ csrfToken, saxobankAppKey, saxobankOauthURL, saxoOauthCallbackPort }: {
  readonly csrfToken: string
  readonly saxobankAppKey: string
  readonly saxobankOauthURL: string | URL
  readonly saxoOauthCallbackPort: number
}): URL {
  const state = btoa(JSON.stringify(assertReturn(StateGuard, {
    csrfToken,
  })))

  const authorizationURL = urlJoin(saxobankOauthURL, 'authorize')

  authorizationURL.searchParams.set('client_id', saxobankAppKey)
  authorizationURL.searchParams.set('response_type', 'code')
  authorizationURL.searchParams.set('state', state)
  authorizationURL.searchParams.set('redirect_uri', `http://localhost:${saxoOauthCallbackPort}/`)

  return authorizationURL
}

function exchangeCodeForSaxoTokens({ code, saxobankAppKey, saxobankAppSecret, saxobankOauthURL }: {
  readonly code: string
  readonly saxobankAppKey: string
  readonly saxobankAppSecret: string
  readonly saxobankOauthURL: string | URL
}): Promise<SaxoTokensResponse> {
  const url = urlJoin(saxobankOauthURL, 'token')
  url.searchParams.set('grant_type', 'authorization_code')
  url.searchParams.set('code', code)

  const client = new HTTPClient()

  return client.postJSON(url, {
    headers: {
      'Authorization': `Basic ${btoa(`${saxobankAppKey}:${saxobankAppSecret}`)}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    guard: SaxoTokensResponseGuard,
  })
}

function refreshSaxoTokens({ refreshToken, saxobankAppKey, saxobankAppSecret, saxobankOauthURL }: {
  readonly refreshToken: string
  readonly saxobankAppKey: string
  readonly saxobankAppSecret: string
  readonly saxobankOauthURL: string | URL
}): Promise<SaxoTokensResponse> {
  const url = urlJoin(saxobankOauthURL, 'token')
  url.searchParams.set('grant_type', 'refresh_token')
  url.searchParams.set('refresh_token', refreshToken)

  const client = new HTTPClient()

  return client.postJSON(url, {
    headers: {
      'Authorization': `Basic ${btoa(`${saxobankAppKey}:${saxobankAppSecret}`)}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    guard: SaxoTokensResponseGuard,
  })
}

function waitForOAuthCallback(
  { port }: { readonly port: number },
): Promise<{
  readonly code: string
  readonly state: string
}> {
  return new Promise((resolve) => {
    const service = Deno.serve({
      port,
      onListen() {
        // Do nothing (default behaviour is to log to console)
      },
    }, (request: Request) => {
      const url = new URL(request.url)

      const code = url.searchParams.get('code')
      const state = url.searchParams.get('state')

      service.shutdown()
      resolve(assertReturn(SaxoOauthCodeResponseGuard, { code, state }))

      return new Response('Authorization successful. You can close this tab now.', {
        status: 200,
        headers: { 'Content-Type': 'text/html' },
      })
    })
  })
}

function getJWTExpiration(jwt: string): number {
  const [, payload] = decode<{ readonly exp: string }>(jwt)
  return parseInt(payload.exp, 10) // Unix timestamp (seconds)
}

async function retrieveCodeFromBrowserAuthentication({
  saxobankAppKey,
  saxobankOauthURL,
  saxoOauthCallbackPort,
}: {
  readonly saxobankAppKey: string
  readonly saxobankOauthURL: string | URL
  readonly saxoOauthCallbackPort: number
}) {
  const csrfToken = generateCSRFToken()

  const authorizationURL = createAuthorizationURL({
    csrfToken,
    saxobankAppKey,
    saxobankOauthURL,
    saxoOauthCallbackPort,
  })

  const oauthCallbackPromise = waitForOAuthCallback({ port: saxoOauthCallbackPort })
  await open(authorizationURL.toString())
  const { code, state } = await oauthCallbackPromise

  // Validate that the CSRF token is the same as the one we generated
  const parsedState = assertReturn(StateGuard, JSON.parse(atob(state)))
  if (parsedState.csrfToken !== csrfToken) {
    throw new Error('CSRF token mismatch')
  }

  return code
}

export class SaxobankOAuth {
  readonly #saxobankAppKey: string
  readonly #saxobankAppSecret: string
  readonly #saxobankOauthURL: string | URL
  readonly #saxoOauthCallbackPort: number

  #authentication: {
    readonly accessToken: string
    readonly accessTokenExpiresAt: Date
    readonly refreshToken: string
    readonly refreshTokenExpiresAt: Date
  }

  private mapTokensResponse(saxoTokensResponse: SaxoTokensResponse): {
    readonly accessToken: string
    readonly accessTokenExpiresAt: Date
    readonly refreshToken: string
    readonly refreshTokenExpiresAt: Date
  } {
    const accessToken = saxoTokensResponse.access_token
    const refreshToken = saxoTokensResponse.refresh_token

    const accessTokenExpirationUnix = getJWTExpiration(accessToken)
    const refreshTokenExporationUnix = accessTokenExpirationUnix - saxoTokensResponse.expires_in +
      saxoTokensResponse.refresh_token_expires_in

    return {
      accessToken,
      accessTokenExpiresAt: new Date(accessTokenExpirationUnix * 1000),
      refreshToken,
      refreshTokenExpiresAt: new Date(refreshTokenExporationUnix * 1000),
    }
  }

  private constructor({ saxobankAppKey, saxobankAppSecret, saxobankOauthURL, saxoOauthCallbackPort, tokensResponse }: {
    readonly saxobankAppKey: string
    readonly saxobankAppSecret: string
    readonly saxobankOauthURL: string | URL
    readonly saxoOauthCallbackPort: number
    readonly tokensResponse: SaxoTokensResponse
  }) {
    this.#saxobankAppKey = saxobankAppKey
    this.#saxobankAppSecret = saxobankAppSecret
    this.#saxobankOauthURL = saxobankOauthURL
    this.#saxoOauthCallbackPort = saxoOauthCallbackPort

    this.#authentication = this.mapTokensResponse(tokensResponse)
  }

  public static async authenticate({
    saxobankAppKey = Environment['SAXOBANK_APP_KEY'],
    saxobankAppSecret = Environment['SAXOBANK_APP_SECRET'],
    saxobankOauthURL = Environment['SAXOBANK_OAUTH_URL'],
    saxoOauthCallbackPort = Environment['SAXOBANK_OAUTH_CALLBACK_PORT'],
  }: {
    readonly saxobankAppKey?: undefined | string
    readonly saxobankAppSecret?: undefined | string
    readonly saxobankOauthURL?: undefined | string | URL
    readonly saxoOauthCallbackPort?: undefined | string | number
  } = {}): Promise<SaxobankOAuth> {
    if (saxobankAppKey === undefined) {
      throw new Error('No app key provided')
    }

    if (saxobankAppSecret === undefined) {
      throw new Error('No app secret provided')
    }

    if (saxobankOauthURL === undefined) {
      throw new Error('No oauth URL provided')
    }

    if (saxoOauthCallbackPort === undefined) {
      throw new Error('No oauth callback port provided')
    }
    const port = typeof saxoOauthCallbackPort === 'string' ? parseInt(saxoOauthCallbackPort) : saxoOauthCallbackPort

    const code = await retrieveCodeFromBrowserAuthentication({
      saxobankAppKey,
      saxobankOauthURL,
      saxoOauthCallbackPort: port,
    })

    const tokensResponse = await exchangeCodeForSaxoTokens({
      code,
      saxobankAppKey,
      saxobankAppSecret,
      saxobankOauthURL,
    })

    return new SaxobankOAuth({
      tokensResponse,
      saxobankAppKey,
      saxobankAppSecret,
      saxobankOauthURL,
      saxoOauthCallbackPort: port,
    })
  }

  public get accessToken(): string {
    return this.#authentication.accessToken
  }

  public get expiresAt(): Date {
    return this.#authentication.accessTokenExpiresAt
  }

  public async reauthorize(): Promise<void> {
    const code = await retrieveCodeFromBrowserAuthentication({
      saxobankAppKey: this.#saxobankAppKey,
      saxobankOauthURL: this.#saxobankOauthURL,
      saxoOauthCallbackPort: this.#saxoOauthCallbackPort,
    })

    const tokensResponse = await exchangeCodeForSaxoTokens({
      code,
      saxobankAppKey: this.#saxobankAppKey,
      saxobankAppSecret: this.#saxobankAppSecret,
      saxobankOauthURL: this.#saxobankOauthURL,
    })

    this.#authentication = this.mapTokensResponse(tokensResponse)
  }

  public async refresh(): Promise<void> {
    if (new Date() >= this.#authentication.refreshTokenExpiresAt) {
      throw new Error('Refresh token has expired - you need to re-authorize')
    }

    const tokensResponse = await refreshSaxoTokens({
      refreshToken: this.#authentication.refreshToken,
      saxobankAppKey: this.#saxobankAppKey,
      saxobankAppSecret: this.#saxobankAppSecret,
      saxobankOauthURL: this.#saxobankOauthURL,
    })

    this.#authentication = this.mapTokensResponse(tokensResponse)
  }
}
