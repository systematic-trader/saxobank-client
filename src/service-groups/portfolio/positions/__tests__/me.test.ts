import { SaxoBankApplication } from '../../../../saxobank-application.ts'
import { describe, expect, test } from '../../../../testing.ts'

describe('portfolio/positions/me', () => {
  test('response passes guard', async () => {
    using app = new SaxoBankApplication()

    const me = await app.portfolio.positions.me.get()

    expect(me).toBeDefined()
  })
})
