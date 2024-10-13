import { SaxoBankApplication } from '../../../../saxobank-application.ts'
import { describe, expect, test } from '../../../../testing.ts'

describe('portfolio/clients/me', () => {
  test('response passes guard', async () => {
    using app = new SaxoBankApplication()

    const me = await app.portfolio.clients.me.get()

    expect(me).toBeDefined()
  })
})
