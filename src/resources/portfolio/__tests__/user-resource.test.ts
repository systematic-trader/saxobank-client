import { expect } from 'std/expect/mod.ts'
import { describe, test } from 'std/testing/bdd.ts'
import { SaxoBankClient } from '../../../../mod.ts'
import { SaxoBank24HourToken } from '../../../authentication/saxobank-24-hour-token.ts'

describe('UserResource', () => {
  const saxoBankClient = new SaxoBankClient({
    prefixURL: 'https://gateway.saxobank.com/sim/openapi',
    authorization: new SaxoBank24HourToken(),
  })

  test('me', async () => {
    const me = await saxoBankClient.portfolio.user.me()

    expect(me).toBeDefined()
  })

  test('getAllEntitlements', async () => {
    const entitlements = await saxoBankClient.portfolio.user.entitlements()

    expect(entitlements).toBeDefined()
  })

  test('users', async () => {
    const users = await saxoBankClient.portfolio.user.users()

    expect(users).toBeDefined()
  })

  test('user', async () => {
    const me = await saxoBankClient.portfolio.user.me() // the only way we can get a known user key is to lookup the current user
    const user = await saxoBankClient.portfolio.user.user({ userKey: me.UserKey })

    expect(user).toBeDefined()
    expect(user).toStrictEqual(me)
  })

  test('userEntitlements', async () => {
    const me = await saxoBankClient.portfolio.user.me() // the only way we can get a known user key is to lookup the current user
    const entitlements = await saxoBankClient.portfolio.user.userEntitlements({
      userKey: me.UserKey,
      entitlementFieldSet: 'Default',
    })

    expect(entitlements).toBeDefined()
  })
})
