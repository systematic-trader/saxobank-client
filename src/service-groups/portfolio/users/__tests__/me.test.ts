import { expect } from 'std/expect/mod.ts'
import { describe, test } from 'std/testing/bdd.ts'
import { SaxoBankApplication } from '../../../../saxobank-application.ts'

describe('portfolio/users/me', () => {
  test('response passes guard', async () => {
    using app = new SaxoBankApplication()

    const me = await app.portfolio.users.me.get()

    expect(me).toBeDefined()
  })
})
