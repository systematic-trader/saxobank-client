import { describe, test } from 'std/testing/bdd.ts'
import { SaxoBankClient } from '../../../../../saxobank-client.ts'
import { SaxoBank24HourToken } from '../../../../../authentication/saxobank-24-hour-token.ts'

describe('portfolio/accounts/account/reset', () => {
  const saxoBankClient = new SaxoBankClient({
    prefixURL: 'https://gateway.saxobank.com/sim/openapi',
    authorization: new SaxoBank24HourToken(),
  })

  test('response passes guard', async () => {
    const [account] = await saxoBankClient.portfolio.accounts.me.get()
    if (account === undefined) {
      throw new Error('No account found')
    }

    await saxoBankClient.portfolio.accounts.account.reset.put({
      AccountKey: account.AccountKey,
      NewBalance: 50000, // in euro
    })
  })
})
