import { expect } from 'std/expect/mod.ts'
import { test } from 'std/testing/bdd.ts'
import { HTTPClient } from '../../../http-client.ts'
import { ResourceClient } from '../../../resource-client.ts'
import { Currencies } from '../currencies.ts'

test('reference-data/currencies', async () => {
  const currencies = new Currencies({
    client: new ResourceClient({ client: HTTPClient.fromEnvironment() }).appendPath('ref'),
  })

  const result = await currencies.get()

  expect(result).toBeDefined()
})
