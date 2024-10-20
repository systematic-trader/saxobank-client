import { SaxoBankApplication } from '../../../../saxobank-application.ts'
import { AssetTypeValues } from '../../../../types/derives/asset-type.ts'
import { expect, test } from '../../../../utils/testing.ts'

test('reference-data/instruments/details', async ({ step }) => {
  using app = new SaxoBankApplication()

  for (const assetType of AssetTypeValues.toSorted()) {
    await step(assetType, async () => {
      const instruments = await app.referenceData.instruments.details.get({ AssetTypes: [assetType] })

      expect(instruments).toBeDefined()

      const firstInstrument = instruments[0]

      if (firstInstrument !== undefined) {
        const instruments2 = await app.referenceData.instruments.details.get({
          AssetTypes: [assetType],
          Uics: [firstInstrument.Uic],
        })

        expect(instruments2).toBeDefined()
      }
    })
  }
})
