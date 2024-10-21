import { expect, test } from '../../../../../utils/testing.ts'
import { SaxoBankApplication } from '../../../../saxobank-application.ts'

test('reference-data/languages', async () => {
  using app = new SaxoBankApplication()

  const languages = await app.referenceData.languages.get()

  expect(languages).toBeDefined()
})
