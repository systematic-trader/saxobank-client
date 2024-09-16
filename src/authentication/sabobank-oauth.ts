import { Environment } from '../environment.ts'
import { SessionTokens } from './session-tokens.ts'
import { RefreshTokenExpiredError } from './refresh-token-expired-error.ts'
import { AuthorizationCode } from './authorization-code.ts'
import { AccessTokenExpiredError } from './access-token-expired-error.ts'
import type { SaxoBankAuthorization } from './saxobank-authentication.ts'

export class SaboBankOAuth implements SaxoBankAuthorization {
  readonly #appKey: string
  readonly #appSecret: string
  readonly #oauthURL: string | URL
  readonly #callbackPort: number
  #sessionTokens: SessionTokens
  #keepAliveTimeout: undefined | number

  private constructor({ appKey, appSecret, oauthURL, callbackPort, sessionTokens }: {
    readonly appKey: string
    readonly appSecret: string
    readonly oauthURL: string | URL
    readonly callbackPort: number
    readonly sessionTokens: SessionTokens
  }) {
    this.#appKey = appKey
    this.#appSecret = appSecret
    this.#oauthURL = oauthURL
    this.#callbackPort = callbackPort
    this.#sessionTokens = sessionTokens
  }

  /**
   * Starts an authentication flow.
   *
   * First, any existing session tokens are restored from disk.
   * If the restored access token is expired, but the refresh token is still valid, the session tokens will be refreshed.
   *
   * If no session tokens are found, or if the refresh token is expired, a new browser window will be opened, where the user can authorize the application.
   */
  public static async authenticate({
    appKey = Environment['SAXOBANK_APP_KEY'],
    appSecret = Environment['SAXOBANK_APP_SECRET'],
    oauthURL = Environment['SAXOBANK_OAUTH_URL'],
    callbackPort = Environment['SAXOBANK_OAUTH_CALLBACK_PORT'],
    keepAlive = true,
  }: {
    readonly appKey?: undefined | string
    readonly appSecret?: undefined | string
    readonly oauthURL?: undefined | string | URL
    readonly callbackPort?: undefined | string | number
    readonly keepAlive?: undefined | boolean | {
      readonly refreshDelayMs?: undefined | number
      readonly retryDelayMs?: undefined | number
    }
  } = {}): Promise<SaboBankOAuth> {
    if (appKey === undefined) {
      throw new Error('No app key provided')
    }

    if (appSecret === undefined) {
      throw new Error('No app secret provided')
    }

    if (oauthURL === undefined) {
      throw new Error('No oauth URL provided')
    }

    if (callbackPort === undefined) {
      throw new Error('No oauth callback port provided')
    }
    const port = typeof callbackPort === 'string' ? parseInt(callbackPort) : callbackPort

    const restoredSessionTokens = await SessionTokens.fromDisk({ appKey })
    if (restoredSessionTokens !== undefined) {
      const { accessTokenExpired, refreshTokenExpired } = restoredSessionTokens.expired

      if (accessTokenExpired === false || refreshTokenExpired === false) {
        const authentication = new SaboBankOAuth({
          appKey,
          appSecret,
          oauthURL,
          callbackPort: port,
          sessionTokens: restoredSessionTokens,
        })

        // todo handle the possibility of the refresh token being expired, before we manage to refresh it
        if (accessTokenExpired === true && refreshTokenExpired === false) {
          await authentication.refresh()
          await authentication.#sessionTokens.saveToDisk({ appKey })
        }

        if (keepAlive === true || typeof keepAlive === 'object') {
          authentication.keepAlive(keepAlive === true ? {} : keepAlive)
        }

        return authentication
      }
    }

    const code = await AuthorizationCode.fromBrowser({
      appKey,
      oauthURL,
      callbackPort: port,
    })

    const freshSessionTokens = await SessionTokens.fromAuthorizationCode({
      code,
      appKey,
      appSecret,
      oauthURL,
    })

    const authentication = new SaboBankOAuth({
      appKey,
      appSecret,
      oauthURL,
      callbackPort: port,
      sessionTokens: freshSessionTokens,
    })

    if (keepAlive === true || typeof keepAlive === 'object') {
      authentication.keepAlive(keepAlive === true ? {} : keepAlive)
    }

    return authentication
  }

  /**
   * Starts a reauthorization flow.
   * This will open a browser window, where the user can authorize the application.
   *
   * In most cases it should be possible to avoid re-authorization by using the keepAlive method.
   */
  public async reauthenticate(): Promise<void> {
    const code = await AuthorizationCode.fromBrowser({
      appKey: this.#appKey,
      oauthURL: this.#oauthURL,
      callbackPort: this.#callbackPort,
    })

    this.#sessionTokens = await SessionTokens.fromAuthorizationCode({
      code,
      appKey: this.#appKey,
      appSecret: this.#appSecret,
      oauthURL: this.#oauthURL,
    })
  }

  public get accessToken(): string {
    const { accessTokenExpired, refreshTokenExpired } = this.#sessionTokens.expired

    if (refreshTokenExpired === true) {
      throw new RefreshTokenExpiredError('You need to re-authenticate')
    }

    if (accessTokenExpired) {
      throw new AccessTokenExpiredError('You need to refresh the session tokens')
    }

    return this.#sessionTokens.accessToken
  }

  /**
   * Manually refreshes the session tokens.
   * Access tokens are valid for 20 minutes, while refresh tokens are valid for 60 minutes.
   *
   * @see keepAlive for a more robust way of keeping the session tokens alive
   */
  public async refresh(): Promise<void> {
    if (new Date() >= this.#sessionTokens.refreshTokenExpiresAt) {
      throw new RefreshTokenExpiredError('You need to re-authenticate')
    }

    this.#sessionTokens = await SessionTokens.fromRefreshToken({
      refreshToken: this.#sessionTokens.refreshToken,
      appKey: this.#appKey,
      appSecret: this.#appSecret,
      oauthURL: this.#oauthURL,
    })
  }

  /**
   * Keep the access token valid by refreshing it periodically.
   *
   * Access tokens are valid for 20 minutes, while refresh tokens are valid for 60 minutes.
   * Therefor, to keep a valid access token, we need to refresh it at least once every 20 minutes.
   * When refreshing the access token, the refresh token is also refreshed.
   *
   * Refreshing every 20 minutes might however not be the best idea, as it might be too infrequent.
   * We should account for network latency, possible maintenance windows, etc.
   *
   * Since existing tokens are still valid, even after refreshing, we can perform the refreshing more frequently.
   * If we refresh the tokens every 1 minutes, we effectively make the system robust enough to handle periods of up to ~59 minutes of downtime.
   *
   * Remember that, if we fail to refresh using the refresh token, we need to re-authenticate, which requires user interaction.
   *
   * @returns A function that can be called to stop the process of refreshing the access token
   */
  public async keepAlive({
    refreshImmediately = false,
    refreshDelayMs = 60 * 1000, // 1 minute
    retryDelayMs = 60 * 1000, // 1 minute
  }: {
    readonly refreshImmediately?: undefined | boolean
    readonly refreshDelayMs?: undefined | number
    readonly retryDelayMs?: undefined | number
  } = {}): Promise<{ stop: () => void }> {
    const { accessTokenExpired, refreshTokenExpired } = this.#sessionTokens.expired

    if (refreshTokenExpired === true) {
      throw new RefreshTokenExpiredError('You need to re-authenticate')
    }

    const stop = () => {
      const timer = this.#keepAliveTimeout
      if (timer === undefined) {
        return
      }

      this.#keepAliveTimeout = undefined
      Deno.refTimer(timer)
      clearTimeout(timer)
    }

    if (this.#keepAliveTimeout !== undefined) {
      stop()
    }

    if (accessTokenExpired === true || refreshImmediately === true) {
      try {
        await this.refresh()
      } catch (error) {
        if (error instanceof RefreshTokenExpiredError) {
          throw error
        }

        this.#keepAliveTimeout = setTimeout(async () => {
          await this.keepAlive({
            refreshImmediately: true,
            refreshDelayMs,
            retryDelayMs,
          })
        }, retryDelayMs)

        return { stop }
      }
    }

    await this.#sessionTokens.saveToDisk({ appKey: this.#appKey })

    this.#keepAliveTimeout = setTimeout(async () => {
      this.#keepAliveTimeout = undefined
      await this.keepAlive({
        refreshImmediately: true,
        refreshDelayMs,
        retryDelayMs,
      })
    }, refreshDelayMs)

    Deno.unrefTimer(this.#keepAliveTimeout)

    return { stop }
  }
}
