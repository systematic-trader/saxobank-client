import { expect } from 'std/expect/mod.ts'
import { describe, test } from 'std/testing/bdd.ts'
import { SaxoBankClient } from '../../../../mod.ts'
import { SaxoBank24HourToken } from '../../../authentication/saxobank-24-hour-token.ts'

describe('ExposureResource', () => {
  const httpClient = new SaxoBankClient({
    prefixURL: 'https://gateway.saxobank.com/sim/openapi',
    authorization: new SaxoBank24HourToken(),
  })

  test('currencyMe', async () => {
    const me = await httpClient.portfolio.exposure.currencyMe()
    expect(me).toBeDefined()
  })

  test('fxSpotMe', async () => {
    const me = await httpClient.portfolio.exposure.fxSpotMe()
    expect(me).toBeDefined()
  })

  test('indstrumentsMe', async () => {
    const me = await httpClient.portfolio.exposure.indstrumentsMe()
    expect(me).toBeDefined()
  })
})
