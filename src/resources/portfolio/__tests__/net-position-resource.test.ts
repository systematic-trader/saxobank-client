import { expect } from 'std/expect/mod.ts'
import { describe, test } from 'std/testing/bdd.ts'
import { SaxoBankClient } from '../../../../mod.ts'
import { SaxoBank24HourToken } from '../../../authentication/saxobank-24-hour-token.ts'

describe('NetPositionResource', () => {
  const saxoBankClient = new SaxoBankClient({
    prefixURL: 'https://gateway.saxobank.com/sim/openapi',
    authorization: new SaxoBank24HourToken(),
  })

  test('me with no field group', async () => {
    const me = await saxoBankClient.portfolio.netPosition.me({
      fieldGroups: [],
    })

    expect(me).toBeDefined()
  })

  test('me with every field group', async () => {
    const me = await saxoBankClient.portfolio.netPosition.me({
      fieldGroups: ['DisplayAndFormat', 'ExchangeInfo', 'Greeks', 'NetPositionBase', 'NetPositionView'],
    })

    expect(me).toBeDefined()
  })
})
