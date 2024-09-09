import { expect } from 'std/expect/mod.ts'
import { describe, test } from 'std/testing/bdd.ts'
import { Environment } from '../../../environment.ts'
import { HTTPClient } from '../../../http-client.ts'
import { PositionResource } from '../position-resource.ts'

describe('PositionResource', () => {
  const token = Environment['SAXOBANK_API_AUTHORIZATION_BEARER_TOKEN']
  if (token === undefined) {
    throw new Error('No token provided')
  }

  const prefixURL = Environment['SAXOBANK_API_PREFIX_URL']
  if (prefixURL === undefined) {
    throw new Error('No prefix URL provided')
  }

  const positionResource = new PositionResource({
    client: HTTPClient.withBearerToken(token),
    prefixURL,
  })

  test('me with no field group', async () => {
    const me = await positionResource.me({
      fieldGroups: [],
    })

    expect(me).toBeDefined()
  })

  test('me with every field group', async () => {
    const me = await positionResource.me({
      fieldGroups: [
        'Costs',
        'DisplayAndFormat',
        'ExchangeInfo',
        'Greeks',
        'PositionBase',
        'PositionIdOnly',
        'PositionView',
      ],
    })

    expect(me).toBeDefined()
  })
})
