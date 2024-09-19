import { expect } from 'std/expect/mod.ts'
import { test } from 'std/testing/bdd.ts'
import { HTTPClient } from '../../../http-client.ts'
import { ResourceClient } from '../../../resource-client.ts'
import { TimeZones } from '../time-zones.ts'

test('reference-data/timezones', async () => {
  const timezones = new TimeZones({
    client: new ResourceClient({ client: HTTPClient.fromEnvironment() }).appendPath('ref'),
  })

  const result = await timezones.get()

  expect(result).toBeDefined()
})
