import { SaxoBankApplication } from '../../../../saxobank-application.ts'
import { expect, test } from '../../../../testing.ts'

test('reference-data/standard-dates/fxoptionexpiry', async () => {
  const resource = new SaxoBankApplication().referenceData.standarddates.fxOptionExpiry

  const fxOptionExpiry = await resource.get({ Uic: 22041762 /*1249*/ })

  expect(fxOptionExpiry).toBeDefined()
})
