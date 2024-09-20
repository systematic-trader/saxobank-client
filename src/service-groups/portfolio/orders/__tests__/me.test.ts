import { expect } from 'std/expect/mod.ts'
import { describe, test } from 'std/testing/bdd.ts'
import { SaxoBank24HourToken } from '../../../../authentication/saxobank-24-hour-token.ts'
import { SaxoBankClient } from '../../../../saxobank-client.ts'

describe('portfolio/orders/me', () => {
  const saxoBankClient = new SaxoBankClient({
    prefixURL: 'https://gateway.saxobank.com/sim/openapi',
    authorization: new SaxoBank24HourToken(),
  })

  test('response passes guard', async () => {
    const me = await saxoBankClient.portfolio.orders.me.get()

    expect(me).toBeDefined()
  })
})
