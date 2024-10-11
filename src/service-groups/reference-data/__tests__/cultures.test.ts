import { expect } from 'std/expect/mod.ts'
import { test } from 'std/testing/bdd.ts'
import { SaxoBankApplication } from '../../../saxobank-application.ts'

test('reference-data/cultures', async () => {
  const resource = new SaxoBankApplication().referenceData.cultures

  const cultures = await resource.get()

  expect(cultures).toBeDefined()
})
