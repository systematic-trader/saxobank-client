import { expect } from 'std/expect/mod.ts'
import { test } from 'std/testing/bdd.ts'
import { SaxoBankApplication } from '../../../saxobank-application.ts'

test('reference-data/algostrategies', async () => {
  const resource = new SaxoBankApplication().referenceData.algostrategies

  const strategies = await resource.get()

  expect(strategies).toBeDefined()

  const strategy = strategies[0]!

  const result = await resource.get({ name: strategy.Name })

  expect(result).toBeDefined()
})
