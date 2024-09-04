import { crypto } from 'https://deno.land/std@0.224.0/crypto/mod.ts'
import { open } from 'https://deno.land/x/open@v0.0.6/index.ts'
import { Environment } from '../environment.ts'
import { urlJoin } from '../resources/utils.ts'
import {
  assertReturn,
  type GuardType,
  integer,
  literal,
  props,
  string,
} from 'https://raw.githubusercontent.com/systematic-trader/type-guard/main/mod.ts'
import { HTTPClient } from '../http-client.ts'

const CallbackGuard = props({
  code: string(),
  state: string(),
})

const StateGuard = props({
  csrfToken: string(),
})

const AccessTokenResponseGuard = props({
  access_token: string(),
  token_type: literal('Bearer'),
  expires_in: integer(),
  refresh_token: string(),
  refresh_token_expires_in: integer(),
  base_uri: literal(null),
})

export interface SaxoAccessTokenResponse extends GuardType<typeof AccessTokenResponseGuard> {}

function createCSRFToken(): string {
  return crypto.randomUUID()
}

function createAuthorizationURL({ csrfToken, saxoAppKey, saxoOauthURL, saxoOauthCallbackPort }: {
  readonly csrfToken: string
  readonly saxoAppKey: string
  readonly saxoOauthURL: string | URL
  readonly saxoOauthCallbackPort: number
}): URL {
  const state = btoa(JSON.stringify(assertReturn(StateGuard, {
    csrfToken,
  })))

  const authorizationURL = urlJoin(saxoOauthURL, 'authorize')

  authorizationURL.searchParams.set('client_id', saxoAppKey)
  authorizationURL.searchParams.set('response_type', 'code')
  authorizationURL.searchParams.set('state', state)
  authorizationURL.searchParams.set('redirect_uri', `http://localhost:${saxoOauthCallbackPort}/`)

  return authorizationURL
}

function getToken({ code, saxoAppKey, saxoAppSecret, saxoOauthURL }: {
  readonly code: string
  readonly saxoAppKey: string
  readonly saxoAppSecret: string
  readonly saxoOauthURL: string | URL
}): Promise<SaxoAccessTokenResponse> {
  const url = urlJoin(saxoOauthURL, 'token')
  url.searchParams.set('grant_type', 'authorization_code')
  url.searchParams.set('code', code)

  const client = new HTTPClient()

  return client.postJSON(url, {
    headers: {
      'Authorization': `Basic ${btoa(`${saxoAppKey}:${saxoAppSecret}`)}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    guard: AccessTokenResponseGuard,
  })
}

function waitForCallback(
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
      resolve(assertReturn(CallbackGuard, { code, state }))

      return new Response('Authorization successful. You can close this tab now.', {
        status: 200,
        headers: { 'Content-Type': 'text/html' },
      })
    })
  })
}

export async function authorize({
  saxoAppKey = Environment['SAXOBANK_APP_KEY'],
  saxoAppSecret = Environment['SAXOBANK_APP_SECRET'],
  saxoOauthURL = Environment['SAXOBANK_OAUTH_URL'],
  saxoOauthCallbackPort = Environment['SAXOBANK_OAUTH_CALLBACK_PORT'],
}: {
  readonly saxoAppKey?: undefined | string
  readonly saxoAppSecret?: undefined | string
  readonly saxoOauthURL?: undefined | string | URL
  readonly saxoOauthCallbackPort?: undefined | string | number
} = {}): Promise<SaxoAccessTokenResponse> {
  if (saxoAppKey === undefined) {
    throw new Error('No app key provided')
  }

  if (saxoAppSecret === undefined) {
    throw new Error('No app secret provided')
  }

  if (saxoOauthURL === undefined) {
    throw new Error('No oauth URL provided')
  }

  if (saxoOauthCallbackPort === undefined) {
    throw new Error('No oauth callback port provided')
  }

  const csrfToken = createCSRFToken()

  const port = typeof saxoOauthCallbackPort === 'string' ? parseInt(saxoOauthCallbackPort) : saxoOauthCallbackPort
  const authorizationURL = createAuthorizationURL({ csrfToken, saxoAppKey, saxoOauthURL, saxoOauthCallbackPort: port })

  // Start the service to listen for the callback
  const callbackPromise = waitForCallback({ port })

  // Open the the authorization URL in the browser
  await open(authorizationURL.toString())

  // Wait for the callback service to recieve the code (after the user has signed in)
  const { code, state } = await callbackPromise

  // Validate that the CSRF token is the same as the one we generated
  const parsedState = assertReturn(StateGuard, JSON.parse(atob(state)))
  if (parsedState.csrfToken !== csrfToken) {
    throw new Error('CSRF token mismatch')
  }

  return getToken({ code, saxoAppKey, saxoAppSecret, saxoOauthURL })
}
