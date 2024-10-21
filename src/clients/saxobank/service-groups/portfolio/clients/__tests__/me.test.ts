import { describe, expect, test } from '../../../../../../utils/testing.ts'
import { SaxoBankApplication } from '../../../../../saxobank-application.ts'

describe('portfolio/clients/me', () => {
  test('response passes guard', async () => {
    using app = new SaxoBankApplication()

    const me = await app.portfolio.clients.me.get()

    expect(me).toBeDefined()
  })
})
