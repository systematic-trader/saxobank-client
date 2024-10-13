import { SaxoBankApplication } from '../../../../saxobank-application.ts'
import { expect, test } from '../../../../testing.ts'

test('reference-data/standard-dates/forward-tenor', async () => {
  const saxobankApp = new SaxoBankApplication()

  const [account] = await saxobankApp.portfolio.accounts.me.get()
  if (account === undefined) {
    throw new Error('No account found')
  }

  const forwardTenor = await saxobankApp.referenceData.standarddates.forwardTenor.get({
    AccountKey: account.AccountKey,
    Uic: 22041762,
  })

  expect(forwardTenor).toBeDefined()
})
