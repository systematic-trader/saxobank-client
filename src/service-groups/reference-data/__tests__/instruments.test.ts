import { expect } from 'std/expect/mod.ts'
import { test } from 'std/testing/bdd.ts'
import { SaxoBankApplication } from '../../../saxobank-application.ts'
import { AssetTypeValues } from '../../../types/derives/asset-type.ts'

test('reference-data/instruments', async ({ step }) => {
  using app = new SaxoBankApplication()

  for (const assetType of AssetTypeValues) {
    await step({
      name: assetType,
      async fn() {
        const instruments = await app.referenceData.instruments.get({ AssetTypes: [assetType] })

        try {
          expect(instruments).toBeDefined()
        } catch (error) {
          // deno-lint-ignore no-console
          console.log(instruments[0])

          throw error
        }
      },
    })
  }
})
