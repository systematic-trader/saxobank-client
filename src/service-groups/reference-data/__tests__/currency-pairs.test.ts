import { expect } from 'std/expect/mod.ts'
import { test } from 'std/testing/bdd.ts'
import { HTTPClient } from '../../../http-client.ts'
import { ResourceClient } from '../../../resource-client.ts'
import { CurrencyPairs } from '../currency-pairs.ts'

test('reference-data/currency-pairs', async () => {
  const resource = new CurrencyPairs({
    client: new ResourceClient({ client: HTTPClient.fromEnvironment() }).appendPath('ref'),
  })

  const currencyPairs = await resource.get()

  expect(currencyPairs).toBeDefined()
})
