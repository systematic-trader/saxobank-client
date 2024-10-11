import { expect } from 'std/expect/mod.ts'
import { test } from 'std/testing/bdd.ts'
import { SaxoBankApplication } from '../../../saxobank-application.ts'

test('reference-data/countries', async () => {
  using app = new SaxoBankApplication()

  const countries = await app.referenceData.countries.get()

  expect(countries).toBeDefined()
})
