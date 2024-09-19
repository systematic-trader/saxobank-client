import { expect } from 'std/expect/mod.ts'
import { test } from 'std/testing/bdd.ts'
import { HTTPClient } from '../../../http-client.ts'
import { ResourceClient } from '../../../resource-client.ts'
import { AlgoStrategies } from '../algostrategies.ts'

test('reference-data/algostrategies', async () => {
  const algostrategies = new AlgoStrategies({
    client: new ResourceClient({ client: HTTPClient.fromEnvironment() }).appendPath('ref'),
  })

  const result = await algostrategies.get()

  expect(result).toBeDefined()
})
