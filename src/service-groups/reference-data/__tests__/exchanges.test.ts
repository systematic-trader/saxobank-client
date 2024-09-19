import { expect } from 'std/expect/mod.ts'
import { test } from 'std/testing/bdd.ts'
import { HTTPClient } from '../../../http-client.ts'
import { ResourceClient } from '../../../resource-client.ts'
import { Exchanges } from '../exchanges.ts'

test('reference-data/exchanges', async () => {
  const exchanges = new Exchanges({
    client: new ResourceClient({ client: HTTPClient.fromEnvironment() }).appendPath('ref'),
  })

  const result = await exchanges.get()

  expect(result).toBeDefined()
})
