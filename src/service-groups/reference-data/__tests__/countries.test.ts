import { SaxoBankApplication } from '../../../saxobank-application.ts'
import { expect, test } from '../../../testing.ts'

test('reference-data/countries', async () => {
  using app = new SaxoBankApplication()

  const countries = await app.referenceData.countries.get()

  expect(countries).toBeDefined()
})
