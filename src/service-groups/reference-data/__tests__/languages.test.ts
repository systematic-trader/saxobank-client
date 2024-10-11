import { expect } from 'std/expect/mod.ts'
import { test } from 'std/testing/bdd.ts'
import { SaxoBankApplication } from '../../../saxobank-application.ts'

test('reference-data/languages', async () => {
  const resource = new SaxoBankApplication().referenceData.languages

  const languages = await resource.get()

  expect(languages).toBeDefined()
})
