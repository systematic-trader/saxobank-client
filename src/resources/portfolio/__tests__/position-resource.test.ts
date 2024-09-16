import { expect } from 'std/expect/mod.ts'
import { describe, test } from 'std/testing/bdd.ts'
import { SaxoBankClient } from '../../../../mod.ts'
import { SaxoBank24HourToken } from '../../../authentication/saxobank-24-hour-token.ts'

describe('PositionResource', () => {
  const httpClient = new SaxoBankClient({
    prefixURL: 'https://gateway.saxobank.com/sim/openapi',
    authorization: new SaxoBank24HourToken(),
  })

  test('me with no field group', async () => {
    const me = await httpClient.portfolio.position.me({
      fieldGroups: [],
    })

    expect(me).toBeDefined()
  })

  test('me with every field group', async () => {
    const me = await httpClient.portfolio.position.me({
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
