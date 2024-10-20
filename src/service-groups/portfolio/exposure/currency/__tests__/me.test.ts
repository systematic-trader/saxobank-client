import { SaxoBankApplication } from '../../../../../saxobank-application.ts'
import { describe, expect, test } from '../../../../../utils/testing.ts'

describe('portfolio/exposure/currency/me', () => {
  test('response passes guard', async () => {
    using app = new SaxoBankApplication()

    const me = await app.portfolio.exposure.currency.me.get()

    expect(me).toBeDefined()
  })
})
