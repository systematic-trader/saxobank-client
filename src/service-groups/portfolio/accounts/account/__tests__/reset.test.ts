import { describe, test } from 'std/testing/bdd.ts'
import { SaxoBankApplication } from '../../../../../saxobank-application.ts'

describe('portfolio/accounts/account/reset', () => {
  test('response passes guard', async () => {
    using app = new SaxoBankApplication()

    const [account] = await app.portfolio.accounts.me.get()
    if (account === undefined) {
      throw new Error('No account found')
    }

    await app.portfolio.accounts.account.reset.put({
      AccountKey: account.AccountKey,
      NewBalance: 50000, // in euro
    })
  })
})
