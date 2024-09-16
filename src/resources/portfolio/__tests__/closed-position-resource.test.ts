import { expect } from 'std/expect/mod.ts'
import { describe, test } from 'std/testing/bdd.ts'
import { SaxoBankClient } from '../../../../mod.ts'
import { SaxoBank24HourToken } from '../../../authentication/saxobank-24-hour-token.ts'

// Running these tests require changing the notting mode: https://openapi.help.saxo/hc/en-us/articles/4468288606365-How-can-I-change-netting-mode
// todo do this automatically (otherwise, it will probably fail after the resetting the account)
describe('ClosedPositionResource', () => {
  const saxoBankClient = new SaxoBankClient({
    prefixURL: 'https://gateway.saxobank.com/sim/openapi',
    authorization: new SaxoBank24HourToken(),
  })

  // todo this requires more testing - different positions will probably have different fields - currently only tested with a forex trade
  test('me', async () => {
    const me = await saxoBankClient.portfolio.closedPosition.me()

    expect(me).toBeDefined()
  })
})
