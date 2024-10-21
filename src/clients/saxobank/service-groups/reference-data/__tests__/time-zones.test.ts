import { expect, test } from '../../../../../utils/testing.ts'
import { SaxoBankApplication } from '../../../../saxobank-application.ts'

test('reference-data/timezones', async () => {
  using app = new SaxoBankApplication()

  const timezones = await app.referenceData.timezones.get()

  expect(timezones).toBeDefined()
})
