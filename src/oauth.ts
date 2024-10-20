import { decode } from 'jsr:@zaubrik/djwt@^3.0.2'

import {
  assertReturn,
  type GuardType,
  integer,
  literal,
  props,
  record,
  string,
} from 'https://raw.githubusercontent.com/systematic-trader/type-guard/main/mod.ts'
import { type HTTPClient, HTTPClientError, HTTPClientRequestAbortError } from './http-client.ts'
import { stringifyJSON } from './utils/json.ts'
import { urlJoin } from './utils/url.ts'

interface OAuthSession {
  readonly accessToken: string
  readonly accessTokenExpiresAt: number
  readonly refreshToken: string
  readonly refreshTokenExpiresAt: number
}

export interface OpenAuthenticationSettings {
  readonly key: string
  readonly secret: string
  readonly authenticationURL: URL
  readonly redirectURL: URL
  readonly listener: {
    readonly hostname: string
    readonly port: number
  }
  readonly storedSessionPath?: undefined | string
  readonly authorize: {
    handle(authorizationURL: URL): void | Promise<void>
    readonly timeout?: undefined | number
  }
}

export class OpenAuthentication {
  readonly #httpClient: HTTPClient
  readonly settings: OpenAuthenticationSettings

  #session: undefined | Promise<undefined | OAuthSession> = undefined

  constructor(client: HTTPClient, settings: OpenAuthenticationSettings) {
    this.#httpClient = client
    this.settings = settings
  }

  #preloadSession(): void {
    if (this.#session === undefined) {
      if (this.settings.storedSessionPath === undefined) {
        this.#session = Promise.resolve(undefined)
      } else {
        this.#session = readSessionsFile(this.settings.storedSessionPath, this.settings.key).then(
          (session) => {
            if (session === undefined) {
              return undefined
            }

            const now = Date.now()

            if (now >= session.refreshTokenExpiresAt) {
              return undefined
            }

            return session
          },
        )
      }
    }
  }

  async refresh(signal?: undefined | AbortSignal): Promise<boolean> {
    if (signal?.aborted === true) {
      return false
    }

    this.#preloadSession()

    const currentSession = await this.#session

    if (currentSession === undefined) {
      return false
    }

    if ((signal?.aborted as undefined | boolean) === true) {
      return false
    }

    if (Date.now() > currentSession.refreshTokenExpiresAt) {
      return false
    }

    const tokenURL = urlJoin(this.settings.authenticationURL, 'token')

    tokenURL.searchParams.set('grant_type', 'refresh_token')
    tokenURL.searchParams.set('refresh_token', currentSession.refreshToken)

    const refreshedSession = await requestAuthenticationToken({
      client: this.#httpClient,
      tokenURL,
      settings: this.settings,
      signal,
    })

    if (refreshedSession === undefined) {
      return false
    }

    if (this.settings.storedSessionPath !== undefined) {
      await writeToSessionsFile(this.settings.storedSessionPath, this.settings.key, refreshedSession)
    }

    if ((signal?.aborted as undefined | boolean) === true) {
      return false
    }

    this.#session = this.#session!.then(() => refreshedSession)

    return true
  }

  async authorize(signal?: undefined | AbortSignal): Promise<boolean> {
    if (signal?.aborted === true) {
      return false
    }

    const csrfToken = crypto.randomUUID()

    const callback = Promise.withResolvers<undefined | CodeResponse>()

    const service = Deno.serve({
      hostname: this.settings.listener.hostname,
      port: this.settings.listener.port,
      signal,

      onListen() {
        // Do nothing (default behaviour is to log to console)
      },
    }, (request: Request) => {
      const url = new URL(request.url)

      const code = url.searchParams.get('code')
      const state = url.searchParams.get('state')

      callback.resolve(assertReturn(CodeResponse, { code, state }))

      return new Response(HTML_SUCCESS, {
        status: 200,
        headers: { 'Content-Type': 'text/html' },
      })
    })

    callback.promise = callback.promise
      .finally(() => {
        return service.shutdown()
      })
      .catch((error) => {
        if (error instanceof Error && error.name === 'AbortError') {
          return undefined
        }

        throw error
      })

    const handshakePromise = callback.promise.then(async (response) => {
      if (response === undefined) {
        return undefined
      }

      if (signal?.aborted === true) {
        return undefined
      }

      const { csrfToken: callbackToken } = assertReturn(CallbackState, JSON.parse(atob(response.state)))

      if (callbackToken !== csrfToken) {
        throw new Error('Cross-Site Request Forgery token mismatch detected!')
      }

      const tokenURL = urlJoin(this.settings.authenticationURL, 'token')

      tokenURL.searchParams.set('grant_type', 'authorization_code')
      tokenURL.searchParams.set('code', response.code)

      return await requestAuthenticationToken({
        client: this.#httpClient,
        tokenURL,
        settings: this.settings,
        signal,
      })
    })

    const csrfTokenEncoded = btoa(stringifyJSON(assertReturn(CallbackState, { csrfToken })))

    const authorizationURL = urlJoin(this.settings.authenticationURL, 'authorize')

    authorizationURL.searchParams.set('client_id', this.settings.key)
    authorizationURL.searchParams.set('response_type', 'code')
    authorizationURL.searchParams.set('state', csrfTokenEncoded)
    authorizationURL.searchParams.set('redirect_uri', this.settings.redirectURL.href)

    await this.settings.authorize.handle(authorizationURL)

    if ((signal?.aborted as undefined | boolean) === true) {
      this.#session = this.#session === undefined ? Promise.resolve(undefined) : this.#session.then(() => undefined)

      return false
    }

    const session = await handshakePromise

    if (session === undefined || (signal?.aborted as undefined | boolean) === true) {
      this.#session = this.#session === undefined ? Promise.resolve(undefined) : this.#session.then(() => undefined)

      return false
    }

    if (this.settings.storedSessionPath !== undefined) {
      await writeToSessionsFile(this.settings.storedSessionPath, this.settings.key, session)
    }

    this.#session = this.#session === undefined ? Promise.resolve(session) : this.#session.then(() => session)

    return true
  }

  async getAccessToken(): Promise<undefined | string> {
    this.#preloadSession()

    const session = await this.#session

    if (session === undefined) {
      return undefined
    }

    if (Date.now() > session.accessTokenExpiresAt) {
      this.#session = this.#session!.then(() => undefined)

      return undefined
    }

    return session.accessToken
  }
}

interface CodeResponse extends GuardType<typeof CodeResponse> {}
const CodeResponse = props({
  code: string({ blank: false }),
  state: string({ blank: false }),
})

interface CallbackState extends GuardType<typeof CallbackState> {}
const CallbackState = props({
  csrfToken: string(),
})

export interface TokensResponse extends GuardType<typeof TokensResponse> {}
export const TokensResponse = props({
  access_token: string(),
  token_type: literal('Bearer'),
  expires_in: integer(),
  refresh_token: string(),
  refresh_token_expires_in: integer(),
  base_uri: literal(null),
})

async function requestAuthenticationToken(
  options: {
    readonly client: HTTPClient
    readonly tokenURL: URL
    readonly settings: OpenAuthentication['settings']
    readonly signal?: undefined | AbortSignal
  },
): Promise<undefined | OAuthSession> {
  if (options.signal?.aborted) {
    return undefined
  }

  try {
    const tokensResponse = await options.client.postOkJSON(options.tokenURL, {
      headers: {
        'Authorization': `Basic ${btoa(`${options.settings.key}:${options.settings.secret}`)}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      guard: TokensResponse,
      signal: options.signal,
    })

    const accessToken = tokensResponse.access_token
    const refreshToken = tokensResponse.refresh_token
    const accessTokenExpiresAt = parseInt(decode<{ readonly exp: string }>(accessToken)[1].exp, 10) * 1000
    const refreshTokenExpirationDelta = (tokensResponse.refresh_token_expires_in - tokensResponse.expires_in) * 1000
    const refreshTokenExpiresAt = accessTokenExpiresAt + refreshTokenExpirationDelta

    return {
      accessToken,
      accessTokenExpiresAt,
      refreshToken,
      refreshTokenExpiresAt,
    }
  } catch (error) {
    if (error instanceof HTTPClientRequestAbortError) {
      return undefined
    }

    if (error instanceof HTTPClientError && error.statusCode === 401) {
      return undefined
    }

    throw error
  }
}

export interface SessionFileContent extends GuardType<typeof SessionFileContent> {}
export const SessionFileContent = record(
  string(),
  props({
    accessToken: string(),
    accessTokenExpiresAt: string({ format: 'date-iso8601' }),
    refreshToken: string(),
    refreshTokenExpiresAt: string({ format: 'date-iso8601' }),
  }),
)

async function readSessionsFile(filePath: string, key: string): Promise<undefined | OAuthSession>
async function readSessionsFile(filePath: string, key?: undefined): Promise<undefined | SessionFileContent>
async function readSessionsFile(
  filePath: string,
  key?: undefined | string,
): Promise<undefined | SessionFileContent | OAuthSession> {
  const fileContent = await Deno.readFile(filePath).catch((error) => {
    if (error instanceof Deno.errors.NotFound) {
      return undefined
    }
  })

  if (fileContent === undefined) {
    return undefined
  }

  const fileContentString = new TextDecoder().decode(fileContent)
  const content = assertReturn(SessionFileContent, JSON.parse(fileContentString))

  if (key === undefined) {
    return content
  }

  const sessionContent = content[key]

  if (sessionContent === undefined) {
    return undefined
  }

  return {
    accessToken: sessionContent.accessToken,
    accessTokenExpiresAt: new Date(sessionContent.accessTokenExpiresAt).getTime(),
    refreshToken: sessionContent.refreshToken,
    refreshTokenExpiresAt: new Date(sessionContent.refreshTokenExpiresAt).getTime(),
  }
}

async function writeToSessionsFile(
  filePath: string,
  key: string,
  session: OAuthSession,
): Promise<void> {
  const existingFileContent = await readSessionsFile(filePath)

  const fileContent: SessionFileContent = {
    ...existingFileContent,
    [key]: {
      accessToken: session.accessToken,
      accessTokenExpiresAt: new Date(session.accessTokenExpiresAt).toISOString(),
      refreshToken: session.refreshToken,
      refreshTokenExpiresAt: new Date(session.refreshTokenExpiresAt).toISOString(),
    },
  }

  const fileContentJSON = stringifyJSON(fileContent, undefined, 2)
  await Deno.writeFile(filePath, new TextEncoder().encode(fileContentJSON))
}

const HTML_SUCCESS = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Authorization successful</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <style>
      @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600&display=swap');
      body {
        font-family: 'Inter', sans-serif;
      }
      .animate-fade-in {
        animation: fadeIn 0.5s ease-out;
      }
      @keyframes fadeIn {
        from {
          opacity: 0;
          transform: translateY(-10px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
    </style>
  </head>
  <body class="bg-gray-50 flex items-center justify-center h-screen">
    <div class="animate-fade-in text-center">
      <div class="mb-8">
        <svg
          class="mx-auto h-16 w-16 text-green-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
          ></path>
        </svg>
      </div>
      <h1 class="text-4xl font-semibold mb-6 text-gray-800">
        Authorization successful
      </h1>
      <p class="mb-2 text-gray-600">You can now close this window</p>
    </div>
  </body>
</html>
`
