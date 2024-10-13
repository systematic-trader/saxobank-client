import { SaxoBankApplication } from '../../../../saxobank-application.ts'
import { describe, expect, test } from '../../../../testing.ts'

describe('portfolio/closedPositions/me', () => {
  test('response passes guard', async () => {
    using app = new SaxoBankApplication()

    const me = await app.portfolio.closedPositions.me.get()

    expect(me).toBeDefined()
  })
})
