import { SaxoBankApplication } from '../../../saxobank-application.ts'
import { expect, test } from '../../../testing.ts'

test('reference-data/currency-pairs', async () => {
  using app = new SaxoBankApplication()

  const currencyPairs = await app.referenceData.currencyPairs.get()

  expect(currencyPairs).toBeDefined()
})
