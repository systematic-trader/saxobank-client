import { open } from 'https://deno.land/x/open@v0.0.6/index.ts'
import { assertReturn, props, string } from 'https://raw.githubusercontent.com/systematic-trader/type-guard/main/mod.ts'
import { urlJoin } from '../service-groups/utils.ts'
import { CodeResponse } from './types/code-response.ts'

const StateGuard = props({
  csrfToken: string(),
})

export class AuthorizationCode {
  static #generateCSRFToken(): string {
    return crypto.randomUUID()
  }

  static #createAuthorizationURL({ csrfToken, appKey, oauthURL, callbackPort }: {
    readonly csrfToken: string
    readonly appKey: string
    readonly oauthURL: string | URL
    readonly callbackPort: number
  }): URL {
    const state = btoa(JSON.stringify(assertReturn(StateGuard, {
      csrfToken,
    })))

    const authorizationURL = urlJoin(oauthURL, 'authorize')

    authorizationURL.searchParams.set('client_id', appKey)
    authorizationURL.searchParams.set('response_type', 'code')
    authorizationURL.searchParams.set('state', state)
    authorizationURL.searchParams.set('redirect_uri', `http://localhost:${callbackPort}/`)

    return authorizationURL
  }

  static async #getOAuthCallback(
    { port }: { readonly port: number },
  ): Promise<CodeResponse> {
    const responseHTML = await Deno.readTextFile(new URL('authorization-successful.html', import.meta.url).pathname)

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
        resolve(assertReturn(CodeResponse, { code, state }))

        return new Response(responseHTML, {
          status: 200,
          headers: { 'Content-Type': 'text/html' },
        })
      })
    })
  }

  static async fromBrowser({
    appKey,
    oauthURL,
    callbackPort,
  }: {
    readonly appKey: string
    readonly oauthURL: string | URL
    readonly callbackPort: number
  }): Promise<string> {
    const csrfToken = this.#generateCSRFToken()

    const authorizationURL = this.#createAuthorizationURL({
      csrfToken,
      appKey,
      oauthURL,
      callbackPort,
    })

    const oauthCallbackPromise = this.#getOAuthCallback({ port: callbackPort })
    open(authorizationURL.toString())

    const { code, state } = await oauthCallbackPromise

    // Validate that the CSRF token is the same as the one we generated
    const parsedState = assertReturn(StateGuard, JSON.parse(atob(state)))
    if (parsedState.csrfToken !== csrfToken) {
      throw new Error('CSRF token mismatch')
    }

    return code
  }
}
