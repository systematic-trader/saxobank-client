import { expect } from 'std/expect/mod.ts'
import { test } from 'std/testing/bdd.ts'
import { HTTPClient } from '../../../../http-client.ts'
import { ResourceClient } from '../../../../resource-client.ts'
import { FxOptionExpiry } from '../fx-option-expiry.ts'

test('reference-data/standard-dates/fxoptionexpiry', async () => {
  const fxOptionExpiry = new FxOptionExpiry({
    client: new ResourceClient({ client: HTTPClient.fromEnvironment() }).appendPath('ref/v1/standarddates'),
  })

  const result = await fxOptionExpiry.get({ Uic: 22041762 /*1249*/ })

  expect(result).toBeDefined()
})
