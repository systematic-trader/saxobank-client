import { expect } from 'std/expect/mod.ts'
import { test } from 'std/testing/bdd.ts'
import { SaxoBankApplication } from '../../../saxobank-application.ts'

test('reference-data/exchanges', async () => {
  const resource = new SaxoBankApplication().referenceData.exchanges

  const exchanges = await resource.get()

  expect(exchanges).toBeDefined()

  const exchange = exchanges[0]!

  const result = await resource.get({ exchangeId: exchange.ExchangeId })

  expect(result).toBeDefined()
})
