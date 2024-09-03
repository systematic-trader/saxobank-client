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

  test('getAllEntitlements', async () => {
    const entitlements = await userResource.entitlements()

    expect(entitlements).toBeDefined()
  })

  test('users', async () => {
    const users = await userResource.users()

    expect(users).toBeDefined()
  })

  test('user', async () => {
    const me = await userResource.me() // the only way we can get a known user key is to lookup the current user
    const user = await userResource.user({ userKey: me.UserKey })

    expect(user).toBeDefined()
    expect(user).toStrictEqual(me)
  })

  test('userEntitlements', async () => {
    const me = await userResource.me() // the only way we can get a known user key is to lookup the current user
    const entitlements = await userResource.userEntitlements({
      userKey: me.UserKey,
      entitlementFieldSet: 'Default',
    })

    expect(entitlements).toBeDefined()
  })
})
