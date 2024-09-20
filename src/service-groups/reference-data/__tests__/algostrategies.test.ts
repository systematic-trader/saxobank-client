import { expect } from 'std/expect/mod.ts'
import { test } from 'std/testing/bdd.ts'
import { HTTPClient } from '../../../http-client.ts'
import { ResourceClient } from '../../../resource-client.ts'
import { AlgoStrategies } from '../algostrategies.ts'

test('reference-data/algostrategies', async () => {
  const resource = new AlgoStrategies({
    client: new ResourceClient({ client: HTTPClient.fromEnvironment() }).appendPath('ref'),
  })

  const strategies = await resource.get()

  expect(strategies).toBeDefined()

  const strategy = strategies[0]!

  const result = await resource.get({ name: strategy.Name })

  expect(result).toBeDefined()
})
