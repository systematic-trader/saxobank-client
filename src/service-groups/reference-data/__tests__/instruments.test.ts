import { expect } from 'std/expect/mod.ts'
import { describe, test } from 'std/testing/bdd.ts'
import { SaxoBank24HourToken } from '../../../authentication/saxobank-24-hour-token.ts'
import { SaxoBankClient } from '../../../saxobank-client.ts'
import { AssetTypeValues } from '../../../types/derives/asset-type.ts'

describe('reference-data/instruments', () => {
  for (const assetType of AssetTypeValues) {
    test(assetType, async () => {
      const resource = new SaxoBankClient({ authorization: new SaxoBank24HourToken() }).referenceData.instruments

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
