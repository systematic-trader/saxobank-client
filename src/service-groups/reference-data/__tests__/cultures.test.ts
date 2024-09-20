import { expect } from 'std/expect/mod.ts'
import { test } from 'std/testing/bdd.ts'
import { HTTPClient } from '../../../http-client.ts'
import { ResourceClient } from '../../../resource-client.ts'
import { Cultures } from '../cultures.ts'

test('reference-data/cultures', async () => {
  const resource = new Cultures({
    client: new ResourceClient({ client: HTTPClient.fromEnvironment() }).appendPath('ref'),
  })

  const cultures = await resource.get()

  expect(cultures).toBeDefined()
})
