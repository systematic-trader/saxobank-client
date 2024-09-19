import { expect } from 'std/expect/mod.ts'
import { test } from 'std/testing/bdd.ts'
import { HTTPClient } from '../../../../http-client.ts'
import { ResourceClient } from '../../../../resource-client.ts'
import { ForwardTenor } from '../forward-tenor.ts'

test('reference-data/standard-dates/forwardtenor', async () => {
  const forwardTenor = new ForwardTenor({
    client: new ResourceClient({ client: HTTPClient.fromEnvironment() }).appendPath('ref/v1/standarddates'),
  })

  const result = await forwardTenor.get({ Uic: 22041762, AccountKey: 'Bla' })

  expect(result).toBeDefined()
})
