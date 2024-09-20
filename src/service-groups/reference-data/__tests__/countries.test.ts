import { expect } from 'std/expect/mod.ts'
import { test } from 'std/testing/bdd.ts'
import { HTTPClient } from '../../../http-client.ts'
import { ResourceClient } from '../../../resource-client.ts'
import { Countries } from '../countries.ts'

test('reference-data/countries', async () => {
  const resource = new Countries({
    client: new ResourceClient({ client: HTTPClient.fromEnvironment() }).appendPath('ref'),
  })

  const countries = await resource.get()

  expect(countries).toBeDefined()
})
