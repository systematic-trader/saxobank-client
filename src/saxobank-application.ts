import { decode } from 'https://deno.land/x/djwt@v3.0.2/mod.ts'
import { open } from 'https://deno.land/x/open@v0.0.6/index.ts'
import * as path from 'jsr:@std/path'

import {
  assertReturn,
  type GuardType,
  integer,
  literal,
  props,
  record,
  string,
} from 'https://raw.githubusercontent.com/systematic-trader/type-guard/main/mod.ts'
import { Environment } from './environment.ts'
import { HTTPClient, HTTPClientError, HTTPClientRequestAbortError } from './http-client.ts'
import { ServiceGroupClient } from './service-group-client.ts'
import { Chart } from './service-groups/chart.ts'
import { ClientServices } from './service-groups/client-services.ts'
import { Portfolio } from './service-groups/portfolio.ts'
import { ReferenceData } from './service-groups/reference-data.ts'
import { Trade } from './service-groups/trade.ts'
import { Timeout, urlJoin } from './utils.ts'

const PERSISTED_SESSION_AUTHENTICATION_FILE_NAME = 'saxobank-authentication.json'
const REFRESH_TOKEN_TIMEOUT = 60_000 // 1 minute

type SaxoBankApplicationType = 'Live' | 'Simulation'

const ApplicationURLs: Record<SaxoBankApplicationType, {
  readonly authenticationURL: string
  readonly serviceURL: string
}> = {
  Live: {
    authenticationURL: 'https://live.logonvalidation.net',
    serviceURL: 'https://gateway.saxobank.com/openapi',
  },
  Simulation: {
    authenticationURL: 'https://sim.logonvalidation.net',
    serviceURL: 'https://gateway.saxobank.com/sim/openapi',
  },
}

export interface SaxoBankApplicationOAuthSession {
  readonly accessToken: string
  readonly accessTokenExpiresAt: number
  readonly refreshToken: string
  readonly refreshTokenExpiresAt: number
}

export interface SaxoBankApplicationSettings {
  /** The type of SaxoBank application to use. */
  readonly type?: undefined | SaxoBankApplicationType

  /** The SaxoBank application key. */
  readonly key?: undefined | string

  /** The SaxoBank application secret. */
  readonly secret?: undefined | string

  /** The URL to redirect to after authentication. */
  readonly redirectURL?: undefined | string | URL | {
    /** The public URL to redirect to after authentication. */
    readonly public?: undefined | string | URL
    /** The local listener to use for the redirect URL. The default is the same as the public URL. */
    readonly listener?: undefined | {
      /** The hostname to listen on. */
      readonly hostname?: undefined | string
      /** The port to listen on. */
      readonly port?: undefined | number | string
    }
  }

  readonly authentication?: undefined | {
    /**
     * Whether to keep the application alive by periodically refreshing the access token.
     * The default is `true`.
     */
    readonly refresh?: undefined | boolean

    /**
     * Authentication tokens are stored between sessions.
     * Set to `false` to disable or provide a custom path.
     * The default is to store in the current working directory as `saxobank-authentication.json`.
     */
    readonly store?: undefined | boolean | string
  }

  /** Configuration for the authorization workflow. */
  readonly authorize?: undefined | {
    /**
     * The function to authenticate the application.
     * The default is to open a local browser window.
     */
    readonly handle?: undefined | ((authorizationURL: URL) => void | Promise<void>)

    /**
     * The timeout for the authorization workflow.
     * The default is to wait indefinitely.
     */
    readonly timeout?: undefined | number
  }
}

export class SaxoBankApplication implements Disposable {
  static live(settings: undefined | Omit<SaxoBankApplicationSettings, 'type'> = {}): SaxoBankApplication {
    const key = settings.key ?? Environment['SAXOBANK_LIVE_APP_KEY']

    if (key === undefined) {
      throw new Error(
        'No SaxoBank application key provided. Did you forget to set the `SAXOBANK_LIVE_APP_KEY` environment variable?',
      )
    }

    const secret = settings.secret ?? Environment['SAXOBANK_LIVE_APP_SECRET']

    if (secret === undefined) {
      throw new Error(
        'No SaxoBank application secret provided. Did you forget to set the `SAXOBANK_LIVE_APP_SECRET` environment variable?',
      )
    }

    return new this({
      key,
      secret,
      ...settings,
      type: 'Live',
    })
  }

  static simulation(
    settings: undefined | Omit<SaxoBankApplicationSettings, 'type'> = {},
  ): SaxoBankApplicationSimulation {
    const key = settings.key ?? Environment['SAXOBANK_SIMULATION_APP_KEY']

    if (key === undefined) {
      throw new Error(
        'No SaxoBank application key provided. Did you forget to set the `SAXOBANK_SIMULATION_APP_KEY` environment variable?',
      )
    }

    const secret = settings.secret ?? Environment['SAXOBANK_SIMULATION_APP_SECRET']

    if (secret === undefined) {
      throw new Error(
        'No SaxoBank application secret provided. Did you forget to set the `SAXOBANK_SIMULATION_APP_SECRET` environment variable?',
      )
    }

    return new SaxoBankApplicationSimulation({
      key,
      secret,
      ...settings,
    })
  }

  readonly settings: {
    readonly authentication: {
      readonly refresh: boolean
      readonly sessionPath: undefined | string
    }

    readonly authorize: {
      readonly handle: (authorizationURL: URL) => void | Promise<void>
      readonly timeout?: undefined | number
    }

    readonly oauth: {
      readonly key: string
      readonly secret: string
      readonly authenticationURL: URL
      readonly redirectURL: URL
      readonly listener: {
        readonly hostname: string
        readonly port: number
      }
    }

    readonly serviceURL: URL
  }

  #session: undefined | SaxoBankApplicationOAuthSession | Promise<undefined | SaxoBankApplicationOAuthSession> =
    undefined

  #refreshRepeater: undefined | Timeout<void> = undefined

  readonly #httpClient: HTTPClient

  get http(): HTTPClient {
    return this.#httpClient
  }

  readonly chart: Chart
  readonly clientServices: ClientServices
  readonly portfolio: Portfolio
  readonly referenceData: ReferenceData
  readonly trade: Trade

  constructor(settings: undefined | SaxoBankApplicationSettings = {}) {
    const envType = Environment['SAXOBANK_APP_TYPE']

    if (typeof envType === 'string' && envType !== 'Live' && envType !== 'Simulation') {
      throw new Error('Invalid SaxoBank application type provided. Must be "Live" or "Simulation"')
    }

    const type = settings.type ?? envType ?? 'Live'

    const sessionCredentialsPath = settings.authentication?.store === false
      ? undefined
      : settings.authentication?.store === undefined || settings.authentication.store === true
      ? PERSISTED_SESSION_AUTHENTICATION_FILE_NAME
      : settings.authentication.store

    const authenticationURL = new URL(ApplicationURLs[type].authenticationURL)

    const key = settings.key ?? Environment['SAXOBANK_APP_KEY']

    if (key === undefined) {
      throw new Error(
        'No SaxoBank application key provided. Did you forget to set the `SAXOBANK_APP_KEY` environment variable?',
      )
    }

    const secret = settings.secret ?? Environment['SAXOBANK_APP_SECRET']

    if (secret === undefined) {
      throw new Error(
        'No SaxoBank application secret provided. Did you forget to set the `SAXOBANK_APP_SECRET` environment variable?',
      )
    }

    let redirectURL =
      (settings.redirectURL === undefined
        ? undefined
        : typeof settings.redirectURL === 'string'
        ? settings.redirectURL
        : settings.redirectURL instanceof URL
        ? settings.redirectURL
        : settings.redirectURL.public) ?? Environment['SAXOBANK_APP_REDIRECT_URL']

    if (redirectURL === undefined) {
      throw new Error(
        'No SaxoBank redirect URL provided. Did you forget to set the `SAXOBANK_APP_REDIRECT_URL` environment variable?',
      )
    }

    redirectURL = new URL(redirectURL)

    if (redirectURL.port === '') {
      redirectURL.port = redirectURL.protocol === 'https:' ? '443' : '80'
    }

    const listenerHostname =
      (settings.redirectURL instanceof URL || typeof settings.redirectURL === 'string'
        ? undefined
        : settings.redirectURL?.listener?.hostname) ??
        Environment['SAXOBANK_APP_REDIRECT_LISTENER_HOSTNAME'] ?? redirectURL.hostname

    const listenerPort = Number.parseInt(
      (settings.redirectURL instanceof URL || typeof settings.redirectURL === 'string'
        ? undefined
        : settings.redirectURL?.listener?.port?.toString()) ??
        Environment['SAXOBANK_APP_REDIRECT_LISTENER_PORT'] ?? redirectURL.port,
      10,
    )

    if (Number.isNaN(listenerPort) || listenerPort < 1 || listenerPort > 65535) {
      throw new Error('Invalid listener port for SaxoBank redirect URL')
    }

    const serviceURL = new URL(ApplicationURLs[type].serviceURL)

    this.settings = {
      authentication: {
        refresh: settings.authentication?.refresh ?? true,
        sessionPath: sessionCredentialsPath === undefined
          ? undefined
          : sessionCredentialsPath[0] === '/'
          ? sessionCredentialsPath
          : path.join(Deno.cwd(), sessionCredentialsPath),
      },
      oauth: {
        key,
        secret,
        authenticationURL,
        redirectURL,
        listener: {
          hostname: listenerHostname,
          port: listenerPort,
        },
      },
      serviceURL,
      authorize: {
        handle: settings.authorize?.handle ?? openLocalBrowser,
        timeout: settings.authorize?.timeout,
      },
    }

    if (this.settings.authentication.sessionPath !== undefined) {
      this.#session = readSessionsFile(this.settings.authentication.sessionPath, this.settings.oauth.key).then(
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

    if (this.settings.authentication.refresh === true) {
      this.#refreshRepeater = Timeout.repeat(REFRESH_TOKEN_TIMEOUT, this.#runKeepAlive.bind(this))
    }

    this.#httpClient = new HTTPClient({
      headers: async () => {
        const session = await this.#session

        if (session === undefined) {
          return undefined
        }

        return {
          'Authorization': `Bearer ${session.accessToken}`,
        }
      },
    })

    const serviceGroupClient = new ServiceGroupClient({
      client: this.#httpClient,
      serviceURL,
      onError: async (error, retries) => {
        if (retries === 0 && error instanceof HTTPClientError && error.statusCode === 401) {
          const session = await this.#authorize()

          if (session === undefined) {
            throw error
          }

          if (this.settings.authentication.sessionPath !== undefined) {
            await writeToSessionsFile(this.settings.authentication.sessionPath, this.settings.oauth.key, session)
          }

          this.#session = session

          return
        }

        throw error
      },
    })

    this.chart = new Chart({ client: serviceGroupClient })
    this.clientServices = new ClientServices({ client: serviceGroupClient })
    this.portfolio = new Portfolio({ client: serviceGroupClient })
    this.referenceData = new ReferenceData({ client: serviceGroupClient })
    this.trade = new Trade({ client: serviceGroupClient })
  }

  async #runKeepAlive(signal: AbortSignal): Promise<void> {
    try {
      if (signal.aborted === true) {
        return
      }

      const currentSession = await this.#session

      if (currentSession === undefined) {
        return
      }

      const refreshedSession = await this.#refresh(signal, currentSession)

      if (refreshedSession === undefined) {
        return
      }

      if (this.settings.authentication.sessionPath !== undefined) {
        await writeToSessionsFile(this.settings.authentication.sessionPath, this.settings.oauth.key, refreshedSession)
      }

      this.#session = refreshedSession
    } catch (error) {
      this.#refreshRepeater?.abort(error)
    }
  }

  async #authorize(signal?: undefined | AbortSignal): Promise<undefined | SaxoBankApplicationOAuthSession> {
    const csrfToken = crypto.randomUUID()

    const callback = Promise.withResolvers<undefined | CodeResponse>()

    const service = Deno.serve({
      hostname: this.settings.oauth.listener.hostname,
      port: this.settings.oauth.listener.port,
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

      const tokenURL = urlJoin(this.settings.oauth.authenticationURL, 'token')

      tokenURL.searchParams.set('grant_type', 'authorization_code')
      tokenURL.searchParams.set('code', response.code)

      return await requestAuthenticationToken({
        client: this.#httpClient,
        tokenURL,
        settings: this.settings.oauth,
        signal,
      })
    })

    const csrfTokenEncoded = btoa(JSON.stringify(assertReturn(CallbackState, { csrfToken })))

    const authorizationURL = urlJoin(this.settings.oauth.authenticationURL, 'authorize')

    authorizationURL.searchParams.set('client_id', this.settings.oauth.key)
    authorizationURL.searchParams.set('response_type', 'code')
    authorizationURL.searchParams.set('state', csrfTokenEncoded)
    authorizationURL.searchParams.set('redirect_uri', this.settings.oauth.redirectURL.href)

    await this.settings.authorize.handle(authorizationURL)

    return handshakePromise
  }

  async #refresh(
    signal: undefined | AbortSignal,
    session: undefined | SaxoBankApplicationOAuthSession,
  ): Promise<undefined | SaxoBankApplicationOAuthSession> {
    if (signal?.aborted === true) {
      return undefined
    }

    if (session === undefined) {
      return undefined
    }

    if (Date.now() > session.refreshTokenExpiresAt) {
      return undefined
    }

    const tokenURL = urlJoin(this.settings.oauth.authenticationURL, 'token')

    tokenURL.searchParams.set('grant_type', 'refresh_token')
    tokenURL.searchParams.set('refresh_token', session.refreshToken)

    const refreshedSession = await requestAuthenticationToken({
      client: this.#httpClient,
      tokenURL,
      settings: this.settings.oauth,
      signal,
    })

    return refreshedSession
  }

  [Symbol.dispose](): void {
    if (this.#refreshRepeater === undefined) {
      return
    }

    this.#refreshRepeater.abort()

    this.#refreshRepeater = undefined
  }

  dispose(): void {
    this[Symbol.dispose]()
  }
}

export class SaxoBankApplicationSimulation extends SaxoBankApplication {
  readonly #serviceGroupClient

  constructor(settings: undefined | Omit<SaxoBankApplicationSettings, 'type'> = {}) {
    super({ ...settings, type: 'Simulation' })

    this.#serviceGroupClient = new ServiceGroupClient({
      client: this.http,
      serviceURL: this.settings.serviceURL,
    })
  }

  /**
   * Reset the account balance to a specific value and deletes all orders and positions.
   * @param balance The new account balance.
   * @param accountKey The account key to reset. If not provided, the account key of the authenticated account is used.
   * @param authToken The 24h token to use for the reset. If not provided, the `SAXOBANK_24H_AUTH_TOKEN` environment variable is used.
   * @returns A promise that resolves when the account has been reset.
   */
  async resetAccount(
    {
      accountKey,
      authToken = Environment['SAXOBANK_24H_AUTH_TOKEN'],
      balance,
    }: {
      readonly accountKey?: undefined | string
      readonly authToken?: undefined | string
      readonly balance: number
    },
  ): Promise<void> {
    if (authToken === undefined) {
      throw new Error(
        'No SaxoBank 24h token provided. Did you forget to set the `SAXOBANK_24H_AUTH_TOKEN` environment variable?',
      )
    }

    if (Number.isSafeInteger(balance) === false || balance <= 0 || balance > 10_000_000) {
      throw new Error('The account balance must be a positive integer between 1 and 100000000')
    }

    if (accountKey === undefined) {
      const [account] = await this.portfolio.accounts.me.get()

      if (account === undefined) {
        throw new Error('No account found for the authenticated user')
      }

      accountKey = account.AccountKey
    }

    await this.#serviceGroupClient.put({
      path: `port/v1/accounts/${accountKey}/reset`,
      headers: {
        Authorization: `Bearer ${authToken}`,
        'Content-Type': 'application/json',
      },
      body: { NewBalance: balance },
    })
  }
}

async function openLocalBrowser(url: URL): Promise<void> {
  const childProcess = await open(url.toString())

  childProcess.stderr?.close()
  childProcess.stdout?.close()
  childProcess.stdin?.close()
  childProcess.close()
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
    readonly settings: SaxoBankApplication['settings']['oauth']
    readonly signal?: undefined | AbortSignal
  },
): Promise<undefined | SaxoBankApplicationOAuthSession> {
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

async function readSessionsFile(filePath: string, key: string): Promise<undefined | SaxoBankApplicationOAuthSession>
async function readSessionsFile(filePath: string, key?: undefined): Promise<undefined | SessionFileContent>
async function readSessionsFile(
  filePath: string,
  key?: undefined | string,
): Promise<undefined | SessionFileContent | SaxoBankApplicationOAuthSession> {
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
  session: SaxoBankApplicationOAuthSession,
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

  const fileContentJSON = JSON.stringify(fileContent, undefined, 2)
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
