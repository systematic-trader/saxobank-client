import { expect } from 'std/expect/mod.ts'
import { test } from 'std/testing/bdd.ts'
import { HTTPClient } from '../../../http-client.ts'
import { ResourceClient } from '../../../resource-client.ts'
import { TimeZones } from '../time-zones.ts'

test('reference-data/timezones', async () => {
  const resource = new TimeZones({
    client: new ResourceClient({ client: HTTPClient.fromEnvironment() }).appendPath('ref'),
  })

  const timezones = await resource.get()

  expect(timezones).toBeDefined()
})
