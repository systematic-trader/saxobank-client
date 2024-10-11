import { expect } from 'std/expect/mod.ts'
import { test } from 'std/testing/bdd.ts'
import { SaxoBankApplication } from '../../../saxobank-application.ts'

test('reference-data/currency-pairs', async () => {
  using app = new SaxoBankApplication()

  const currencyPairs = await app.referenceData.currencyPairs.get()

  expect(currencyPairs).toBeDefined()
})
