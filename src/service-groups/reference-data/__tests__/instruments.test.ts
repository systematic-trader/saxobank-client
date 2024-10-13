import { SaxoBankApplication } from '../../../saxobank-application.ts'
import { expect, test } from '../../../testing.ts'
import { AssetTypeValues } from '../../../types/derives/asset-type.ts'

test('reference-data/instruments', async ({ step }) => {
  using app = new SaxoBankApplication()

  for (const assetType of AssetTypeValues) {
    await step({
      name: assetType,
      async fn() {
        const instruments = await app.referenceData.instruments.get({ AssetTypes: [assetType] })

        expect(instruments).toBeDefined()
      },
    })
  }
})
