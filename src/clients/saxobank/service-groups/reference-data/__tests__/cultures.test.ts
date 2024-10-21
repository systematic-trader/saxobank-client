import { expect, test } from '../../../../../utils/testing.ts'
import { SaxoBankApplication } from '../../../../saxobank-application.ts'

test('reference-data/cultures', async () => {
  using app = new SaxoBankApplication()

  const cultures = await app.referenceData.cultures.get()

  expect(cultures).toBeDefined()
})
