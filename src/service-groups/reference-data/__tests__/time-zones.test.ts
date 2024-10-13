import { SaxoBankApplication } from '../../../saxobank-application.ts'
import { expect, test } from '../../../testing.ts'

test('reference-data/timezones', async () => {
  using app = new SaxoBankApplication()

  const timezones = await app.referenceData.timezones.get()

  expect(timezones).toBeDefined()
})
