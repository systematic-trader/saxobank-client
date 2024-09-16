import { expect } from 'std/expect/mod.ts'
import { describe, test } from 'std/testing/bdd.ts'
import { SaxoBank24HourToken } from '../../../authentication/saxobank-24-hour-token.ts'
import { SaxoBankClient } from '../../../saxobank-client.ts'

describe('AccountGroupResource', () => {
  const httpClient = new SaxoBankClient({
    prefixURL: 'https://gateway.saxobank.com/sim/openapi',
    authorization: new SaxoBank24HourToken(),
  })

  test('accountGroups', async () => {
    const client = await httpClient.portfolio.client.me() // the only way we can get a known client key is to lookup the current client
    const accountGroups = await httpClient.portfolio.accountGroups.accountGroups({ clientKey: client.ClientKey })

    expect(accountGroups).toBeDefined()
  })

  test('accountGroup', async () => {
    // todo find a way to test this (saxo simulation environment does not have any account groups)
  })

  test('me', async () => {
    const me = await httpClient.portfolio.accountGroups.me()

    expect(me).toBeDefined()
  })
})
