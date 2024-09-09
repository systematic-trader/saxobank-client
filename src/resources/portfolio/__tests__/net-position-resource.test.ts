import { expect } from 'std/expect/mod.ts'
import { describe, test } from 'std/testing/bdd.ts'
import { Environment } from '../../../environment.ts'
import { HTTPClient } from '../../../http-client.ts'
import { NetPositionResource } from '../net-position-resource.ts'

describe('NetPositionResource', () => {
  const token = Environment['SAXOBANK_API_AUTHORIZATION_BEARER_TOKEN']
  if (token === undefined) {
    throw new Error('No token provided')
  }

  const prefixURL = Environment['SAXOBANK_API_PREFIX_URL']
  if (prefixURL === undefined) {
    throw new Error('No prefix URL provided')
  }

  const netPositionResource = new NetPositionResource({
    client: HTTPClient.withBearerToken(token),
    prefixURL,
  })

  test('me with no field group', async () => {
    const me = await netPositionResource.me({
      fieldGroups: [],
    })

    expect(me).toBeDefined()
  })

  test('me with every field group', async () => {
    const me = await netPositionResource.me({
      fieldGroups: ['DisplayAndFormat', 'ExchangeInfo', 'Greeks', 'NetPositionBase', 'NetPositionView'],
    })

    expect(me).toBeDefined()
  })
})
