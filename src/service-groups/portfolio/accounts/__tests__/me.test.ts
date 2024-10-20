import { SaxoBankApplication } from '../../../../saxobank-application.ts'
import { describe, expect, test } from '../../../../utils/testing.ts'

describe('portfolio/accounts/me', () => {
  test('response passes guard', async () => {
    using app = new SaxoBankApplication()

    const me = await app.portfolio.accounts.me.get()

    expect(me).toBeDefined()
  })
})
