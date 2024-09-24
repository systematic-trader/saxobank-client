import { expect } from 'std/expect/mod.ts'
import { describe, test } from 'std/testing/bdd.ts'
import { HTTPClient } from '../../../http-client.ts'
import { ResourceClient } from '../../../resource-client.ts'
import { AssetTypeValues } from '../../../types/derives/asset-type.ts'
import { Instruments } from '../instruments.ts'

describe('reference-data/instruments', () => {
  for (const assetType of AssetTypeValues) {
    test(assetType, async () => {
      const resource = new Instruments({
        client: new ResourceClient({ client: HTTPClient.fromEnvironment() }).appendPath('ref'),
      })

      const instruments = await resource.get({ AssetTypes: [assetType] })

      try {
        expect(instruments).toBeDefined()
      } catch (error) {
        // deno-lint-ignore no-console
        console.log(instruments[0])

        throw error
      }
    })
  }
})
