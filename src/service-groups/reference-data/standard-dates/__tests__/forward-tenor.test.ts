import { expect } from 'std/expect/mod.ts'
import { test } from 'std/testing/bdd.ts'
import { SaxoBankClient } from '../../../../../mod.ts'
import { SaxoBank24HourToken } from '../../../../authentication/saxobank-24-hour-token.ts'

test('reference-data/standard-dates/forward-tenor', async () => {
  const saxoBankClient = new SaxoBankClient({
    prefixURL: 'https://gateway.saxobank.com/sim/openapi',
    authorization: new SaxoBank24HourToken(),
  })

  const [account] = await saxoBankClient.portfolio.accounts.me.get()
  if (account === undefined) {
    throw new Error('No account found')
  }

  const forwardTenor = await saxoBankClient.referenceData.standarddates.forwardTenor.get({
    AccountKey: account.AccountKey,
    Uic: 22041762,
  })

  expect(forwardTenor).toBeDefined()
})
