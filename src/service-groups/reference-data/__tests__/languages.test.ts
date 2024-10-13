import { SaxoBankApplication } from '../../../saxobank-application.ts'
import { expect, test } from '../../../testing.ts'

test('reference-data/languages', async () => {
  using app = new SaxoBankApplication()

  const languages = await app.referenceData.languages.get()

  expect(languages).toBeDefined()
})
