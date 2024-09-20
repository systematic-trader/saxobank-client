import { expect } from 'std/expect/mod.ts'
import { describe, test } from 'std/testing/bdd.ts'
import { SaxoBankClient } from '../../../../../saxobank-client.ts'
import { SaxoBank24HourToken } from '../../../../../authentication/saxobank-24-hour-token.ts'

describe('portfolio/exposure/fxSpot/me', () => {
  const saxoBankClient = new SaxoBankClient({
    prefixURL: 'https://gateway.saxobank.com/sim/openapi',
    authorization: new SaxoBank24HourToken(),
  })

  test('response passes guard', async () => {
    const me = await saxoBankClient.portfolio.exposure.fxSpot.me.get()

    expect(me).toBeDefined()
  })
})
