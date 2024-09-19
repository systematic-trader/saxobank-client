import { expect } from 'std/expect/mod.ts'
import { test } from 'std/testing/bdd.ts'
import { HTTPClient } from '../../../http-client.ts'
import { ResourceClient } from '../../../resource-client.ts'
import { CurrencyPairs } from '../currency-pairs.ts'

test('reference-data/currency-pairs', async () => {
  const currencyPairs = new CurrencyPairs({
    client: new ResourceClient({ client: HTTPClient.fromEnvironment() }).appendPath('ref'),
  })

  const result = await currencyPairs.get()

  expect(result).toBeDefined()
})
