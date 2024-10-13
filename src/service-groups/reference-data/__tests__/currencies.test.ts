import { SaxoBankApplication } from '../../../saxobank-application.ts'
import { expect, test } from '../../../testing.ts'

test('reference-data/currencies', async () => {
  using app = new SaxoBankApplication()

  const currencies = await app.referenceData.currencies.get()

  expect(currencies).toBeDefined()
})
