import { expect } from 'std/expect/mod.ts'
import { test } from 'std/testing/bdd.ts'
import { HTTPClient } from '../../../http-client.ts'
import { ResourceClient } from '../../../resource-client.ts'
import { Exchanges } from '../exchanges.ts'

test('reference-data/exchanges', async () => {
  const resource = new Exchanges({
    client: new ResourceClient({ client: HTTPClient.fromEnvironment() }).appendPath('ref'),
  })

  const exchanges = await resource.get()

  expect(exchanges).toBeDefined()

  const exchange = exchanges[0]!

  const result = await resource.get({ exchangeId: exchange.ExchangeId })

  expect(result).toBeDefined()
})
