import { expect } from 'std/expect/mod.ts'
import { test } from 'std/testing/bdd.ts'
import { SaxoBank24HourToken } from '../../../authentication/saxobank-24-hour-token.ts'
import { SaxoBankClient } from '../../../saxobank-client.ts'

test('reference-data/cultures', async () => {
  const resource = new SaxoBankClient({ authorization: new SaxoBank24HourToken() }).referenceData.cultures

  const cultures = await resource.get()

  expect(cultures).toBeDefined()
})
