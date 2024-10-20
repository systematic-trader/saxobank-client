import { SaxoBankApplication } from '../../../../saxobank-application.ts'
import { describe, expect, test } from '../../../../utils/testing.ts'

describe('portfolio/users/me', () => {
  test('response passes guard', async () => {
    using app = new SaxoBankApplication()

    const me = await app.portfolio.users.me.get()

    expect(me).toBeDefined()
  })
})
