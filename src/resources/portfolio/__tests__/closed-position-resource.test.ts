import { expect } from 'std/expect/mod.ts'
import { describe, test } from 'std/testing/bdd.ts'
import { Environment } from '../../../environment.ts'
import { HTTPClient } from '../../../http-client.ts'
import { ClosedPositionResource } from '../closed-position-resource.ts'

// Running these tests require changing the notting mode: https://openapi.help.saxo/hc/en-us/articles/4468288606365-How-can-I-change-netting-mode
// todo do this automatically (otherwise, it will probably fail after the resetting the account)
describe('ClosedPositionResource', () => {
  const token = Environment['SAXOBANK_API_AUTHORIZATION_BEARER_TOKEN']
  if (token === undefined) {
    throw new Error('No token provided')
  }

  const prefixURL = Environment['SAXOBANK_API_PREFIX_URL']
  if (prefixURL === undefined) {
    throw new Error('No prefix URL provided')
  }

  const closedPositionResource = new ClosedPositionResource({
    client: HTTPClient.withBearerToken(token),
    prefixURL,
  })

  // todo this requires more testing - different positions will probably have different fields - currently only tested with a forex trade
  test('me', async () => {
    const me = await closedPositionResource.me({
      fieldGroups: ['ClosedPosition'],
    })

    expect(me).toBeDefined()
  })
})
