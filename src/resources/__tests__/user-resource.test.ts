import { expect } from 'std/expect/mod.ts'
import { describe, test } from 'std/testing/bdd.ts'
import { Environment } from '../../environment.ts'
import { HTTPClient } from '../../http-client.ts'
import { UserResource } from '../user-resource.ts'

describe('UserResource', () => {
  const token = Environment['SAXOBANK_API_AUTHORIZATION_BEARER_TOKEN']
  if (token === undefined) {
    throw new Error('No token provided')
  }

  const prefixURL = Environment['SAXOBANK_API_PREFIX_URL']
  if (prefixURL === undefined) {
    throw new Error('No prefix URL provided')
  }

  const userResource = new UserResource({
    client: HTTPClient.withBearerToken(token),
    prefixURL,
  })

  test('me', async () => {
    const me = await userResource.me()

    expect(me).toBeDefined()
  })
})
