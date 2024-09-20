import { expect } from 'std/expect/mod.ts'
import { test } from 'std/testing/bdd.ts'
import { HTTPClient } from '../../../http-client.ts'
import { ResourceClient } from '../../../resource-client.ts'
import { Currencies } from '../currencies.ts'

test('reference-data/currencies', async () => {
  const resource = new Currencies({
    client: new ResourceClient({ client: HTTPClient.fromEnvironment() }).appendPath('ref'),
  })

  const currencies = await resource.get()

  expect(currencies).toBeDefined()
})
