import { expect } from 'std/expect/mod.ts'
import { test } from 'std/testing/bdd.ts'
import { SaxoBank24HourToken } from '../../../authentication/saxobank-24-hour-token.ts'
import { SaxoBankClient } from '../../../saxobank-client.ts'

test('reference-data/languages', async () => {
  const resource = new SaxoBankClient({ authorization: new SaxoBank24HourToken() }).referenceData.languages

  const languages = await resource.get()

  expect(languages).toBeDefined()
})
