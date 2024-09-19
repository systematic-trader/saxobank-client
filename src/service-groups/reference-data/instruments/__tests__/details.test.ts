import { expect } from 'std/expect/mod.ts'
import { test } from 'std/testing/bdd.ts'
import { HTTPClient } from '../../../../http-client.ts'
import { ResourceClient } from '../../../../resource-client.ts'
import { InstrumentsDetails } from '../details.ts'

test('reference-data/instruments/details', async () => {
  const details = new InstrumentsDetails({
    client: new ResourceClient({ client: HTTPClient.fromEnvironment() }).appendPath('ref/v1/instruments'),
  })

  const etns = await details.get({ AssetTypes: ['Etn'] })

  expect(etns).toBeDefined()

  const nvidia = await details.get({ Uics: [1249] })

  expect(nvidia).toBeDefined()
})
