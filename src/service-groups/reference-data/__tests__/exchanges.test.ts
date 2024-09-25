import { expect } from 'std/expect/mod.ts'
import { test } from 'std/testing/bdd.ts'
import { SaxoBank24HourToken } from '../../../authentication/saxobank-24-hour-token.ts'
import { SaxoBankClient } from '../../../saxobank-client.ts'

test('reference-data/exchanges', async () => {
  const resource = new SaxoBankClient({ authorization: new SaxoBank24HourToken() }).referenceData.exchanges

  const exchanges = await resource.get()

  expect(exchanges).toBeDefined()

  const exchange = exchanges[0]!

  const result = await resource.get({ exchangeId: exchange.ExchangeId })

  expect(result).toBeDefined()
})
