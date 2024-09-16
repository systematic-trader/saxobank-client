import { expect } from 'std/expect/mod.ts'
import { describe, test } from 'std/testing/bdd.ts'
import { SaxoBankClient } from '../../../../mod.ts'
import { SaxoBank24HourToken } from '../../../authentication/saxobank-24-hour-token.ts'

describe('UserResource', () => {
  const httpClient = new SaxoBankClient({
    prefixURL: 'https://gateway.saxobank.com/sim/openapi',
    authorization: new SaxoBank24HourToken(),
  })

  test('me', async () => {
    const me = await httpClient.portfolio.user.me()

    expect(me).toBeDefined()
  })

  test('getAllEntitlements', async () => {
    const entitlements = await httpClient.portfolio.user.entitlements()

    expect(entitlements).toBeDefined()
  })

  test('users', async () => {
    const users = await httpClient.portfolio.user.users()

    expect(users).toBeDefined()
  })

  test('user', async () => {
    const me = await httpClient.portfolio.user.me() // the only way we can get a known user key is to lookup the current user
    const user = await httpClient.portfolio.user.user({ userKey: me.UserKey })

    expect(user).toBeDefined()
    expect(user).toStrictEqual(me)
  })

  test('userEntitlements', async () => {
    const me = await httpClient.portfolio.user.me() // the only way we can get a known user key is to lookup the current user
    const entitlements = await httpClient.portfolio.user.userEntitlements({
      userKey: me.UserKey,
      entitlementFieldSet: 'Default',
    })

    expect(entitlements).toBeDefined()
  })
})
