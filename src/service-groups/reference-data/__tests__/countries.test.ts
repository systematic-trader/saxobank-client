import { expect } from 'std/expect/mod.ts'
import { test } from 'std/testing/bdd.ts'
import { SaxoBankApplication } from '../../../saxobank-application.ts'

test('reference-data/countries', async () => {
  const resource = new SaxoBankApplication().referenceData.countries

  const countries = await resource.get()

  expect(countries).toBeDefined()
})
