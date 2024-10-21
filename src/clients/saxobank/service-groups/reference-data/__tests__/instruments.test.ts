import { expect, test } from '../../../../../utils/testing.ts'
import { SaxoBankApplication } from '../../../../saxobank-application.ts'
import { AssetTypeValues } from '../../../types/derives/asset-type.ts'

test('reference-data/instruments', async ({ step }) => {
  using app = new SaxoBankApplication()

  for (const assetType of AssetTypeValues.toSorted()) {
    // for (const assetType of ['ContractFutures'] as const) {
    await step({
      name: assetType,
      async fn() {
        const instruments = await app.referenceData.instruments.get({
          AssetTypes: [assetType],
          IncludeNonTradable: true,
        })

        expect(instruments).toBeDefined()
      },
    })
  }
})
