import { expect } from 'std/expect/mod.ts'
import { test } from 'std/testing/bdd.ts'
import { SaxoBankApplication } from '../../../../saxobank-application.ts'

test('reference-data/standard-dates/fxoptionexpiry', async () => {
  const resource = new SaxoBankApplication().referenceData.standarddates.fxOptionExpiry

  const fxOptionExpiry = await resource.get({ Uic: 22041762 /*1249*/ })

  expect(fxOptionExpiry).toBeDefined()
})
