import { expect } from 'std/expect/mod.ts'
import { test } from 'std/testing/bdd.ts'
import { SaxoBankApplication } from '../../../../saxobank-application.ts'
import { AssetTypeValues } from '../../../../types/derives/asset-type.ts'

test('reference-data/instruments/details', async ({ step }) => {
  const { details: resource } = new SaxoBankApplication().referenceData.instruments

  for (const assetType of AssetTypeValues) {
    await step({
      name: assetType,
      async fn() {
        const instruments = await resource.get({ AssetTypes: [assetType] })

        try {
          expect(instruments).toBeDefined()
        } catch (error) {
          // deno-lint-ignore no-console
          console.log('instruments', instruments[0])

          throw error
        }

        const firstInstrument = instruments[0]

        if (firstInstrument !== undefined) {
          const instruments2 = await resource.get({ AssetTypes: [assetType], Uics: [firstInstrument.Uic] })

          expect(instruments2).toBeDefined()
        }
      },
    })
  }
})
