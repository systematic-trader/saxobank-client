import { expect } from 'std/expect/mod.ts'
import { test } from 'std/testing/bdd.ts'
import { SaxoBankApplication } from '../../../saxobank-application.ts'

test('reference-data/timezones', async () => {
  const resource = new SaxoBankApplication().referenceData.timezones

  const timezones = await resource.get()

  expect(timezones).toBeDefined()
})
