import { expect } from 'std/expect/mod.ts'
import { describe, test } from 'std/testing/bdd.ts'
import { Environment } from '../../environment.ts'
import { HTTPClient } from '../../http-client.ts'
import { ClientResource } from '../client-resource.ts'

describe('ClientResource', () => {
  const token = Environment['SAXOBANK_API_AUTHORIZATION_BEARER_TOKEN']

  if (token === undefined) {
    throw new Error('No token provided')
  }

  const clientResource = new ClientResource(HTTPClient.withBearerToken(token))

  test('me', async () => {
    const me = await clientResource.me()

    expect(me).toBeDefined()
  })
})
