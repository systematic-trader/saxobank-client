import { expect } from 'std/expect/mod.ts'
import { test } from 'std/testing/bdd.ts'
import { SaxoBankApplication } from '../../../saxobank-application.ts'

test('reference-data/currencies', async () => {
  const resource = new SaxoBankApplication().referenceData.currencies

  const currencies = await resource.get()

  expect(currencies).toBeDefined()
})
