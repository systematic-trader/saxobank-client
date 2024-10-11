import { expect } from 'std/expect/mod.ts'
import { describe, test } from 'std/testing/bdd.ts'
import { SaxoBankApplication } from '../../../../../saxobank-application.ts'

describe('portfolio/exposure/fxSpot/me', () => {
  test('response passes guard', async () => {
    using app = new SaxoBankApplication()

    const me = await app.portfolio.exposure.fxSpot.me.get()

    expect(me).toBeDefined()
  })
})
