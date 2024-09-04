import { expect } from 'std/expect/mod.ts'
import { describe, test } from 'std/testing/bdd.ts'
import { Environment } from '../../../environment.ts'
import { HTTPClient } from '../../../http-client.ts'
import { ExposureResource } from '../exposure-resource.ts'

describe('ExposureResource', () => {
  const token = Environment['SAXOBANK_API_AUTHORIZATION_BEARER_TOKEN']
  if (token === undefined) {
    throw new Error('No token provided')
  }

  const prefixURL = Environment['SAXOBANK_API_PREFIX_URL']
  if (prefixURL === undefined) {
    throw new Error('No prefix URL provided')
  }

  const exposureResource = new ExposureResource({
    client: HTTPClient.withBearerToken(token),
    prefixURL,
  })

  test('currencyMe', async () => {
    const me = await exposureResource.currencyMe()
    expect(me).toBeDefined()
  })

  test('fxSpotMe', async () => {
    const me = await exposureResource.fxSpotMe()
    expect(me).toBeDefined()
  })

  test('indstrumentsMe', async () => {
    const me = await exposureResource.indstrumentsMe()
    expect(me).toBeDefined()
  })
})
