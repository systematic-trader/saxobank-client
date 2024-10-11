import { expect } from 'std/expect/mod.ts'
import { test } from 'std/testing/bdd.ts'
import { SaxoBankApplication } from '../../../saxobank-application.ts'

test('reference-data/currencies', async () => {
  using app = new SaxoBankApplication()

  const currencies = await app.referenceData.currencies.get()

  expect(currencies).toBeDefined()
})
