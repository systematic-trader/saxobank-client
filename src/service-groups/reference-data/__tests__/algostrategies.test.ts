import { expect } from 'std/expect/mod.ts'
import { test } from 'std/testing/bdd.ts'
import { SaxoBank24HourToken } from '../../../authentication/saxobank-24-hour-token.ts'
import { SaxoBankClient } from '../../../saxobank-client.ts'

test('reference-data/algostrategies', async () => {
  const resource = new SaxoBankClient({ authorization: new SaxoBank24HourToken() }).referenceData.algostrategies

  const strategies = await resource.get()

  expect(strategies).toBeDefined()

  const strategy = strategies[0]!

  const result = await resource.get({ name: strategy.Name })

  expect(result).toBeDefined()
})
