import { describe, expect, test } from '../../../../../../utils/testing.ts'
import { SaxoBankApplication } from '../../../../../saxobank-application.ts'

describe('portfolio/account-groups/me', () => {
  test('response passes guard', async () => {
    using app = new SaxoBankApplication()

    const me = await app.portfolio.accountGroups.me.get()

    expect(me).toBeDefined()
  })
})
