import { array } from 'https://raw.githubusercontent.com/systematic-trader/type-guard/main/mod.ts'
import type { HTTPClient } from '../../http-client.ts'
import { CurrencyExposuresResponse } from '../../types/records/currency-exposures-response.ts'
import { urlJoin } from '../utils.ts'
import { InstrumentExposureResponse } from '../../types/records/instrument-exposure-response.ts'

/**
 * Read only end points serving exposure of positions. The exposure results are restricted by the supplied query parameters as well as whether or not the identity represented by the authorization token has access to the client/account owner of the underlying positions.
 * - A user of a client will have access to accounts under that client
 * - A user of an IB or WLC will have access to accounts on that client or clients there under
 * - An employee has access to all accounts
 */
export class ExposureResource {
  readonly #client: HTTPClient
  readonly #resourceURL: URL

  constructor({
    client,
    prefixURL,
  }: {
    readonly client: HTTPClient
    readonly prefixURL: string
  }) {
    this.#client = client
    this.#resourceURL = urlJoin(prefixURL, 'port', 'v1', 'exposure')
  }

  /** Get currency exposures for a client, to which the logged in user belongs */
  currencyMe(): Promise<ReadonlyArray<CurrencyExposuresResponse>> {
    const url = urlJoin(this.#resourceURL, 'currency', 'me')

    return this.#client.getJSON(url, {
      guard: array(CurrencyExposuresResponse),
    })
  }

  /** Get net FxSpot exposures for a client, to which the logged in user belongs */
  fxSpotMe(): Promise<ReadonlyArray<CurrencyExposuresResponse>> {
    const url = urlJoin(this.#resourceURL, 'fxspot', 'me')

    return this.#client.getJSON(url, {
      guard: array(CurrencyExposuresResponse),
    })
  }

  /** Get the net instrument exposure for a client, to which the logged in user belongs */
  indstrumentsMe(): Promise<ReadonlyArray<InstrumentExposureResponse>> {
    const url = urlJoin(this.#resourceURL, 'instruments', 'me')

    return this.#client.getJSON(url, {
      guard: array(InstrumentExposureResponse),
    })
  }
}
