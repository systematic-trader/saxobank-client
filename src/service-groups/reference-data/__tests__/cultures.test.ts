import { SaxoBankApplication } from '../../../saxobank-application.ts'
import { expect, test } from '../../../utils/testing.ts'

test('reference-data/cultures', async () => {
  using app = new SaxoBankApplication()

  const cultures = await app.referenceData.cultures.get()

  expect(cultures).toBeDefined()
})
