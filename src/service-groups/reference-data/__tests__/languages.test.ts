import { expect } from 'std/expect/mod.ts'
import { test } from 'std/testing/bdd.ts'
import { HTTPClient } from '../../../http-client.ts'
import { ResourceClient } from '../../../resource-client.ts'
import { Languages } from '../languages.ts'

test('reference-data/languages', async () => {
  const languages = new Languages({
    client: new ResourceClient({ client: HTTPClient.fromEnvironment() }).appendPath('ref'),
  })

  const result = await languages.get()

  expect(result).toBeDefined()
})
