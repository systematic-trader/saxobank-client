import { expect } from 'std/expect/mod.ts'
import { test } from 'std/testing/bdd.ts'
import { SaxoBankApplication } from '../../../../saxobank-application.ts'
import { AssetTypeValues } from '../../../../types/derives/asset-type.ts'
import { Timeout } from '../../../../utils.ts'

Timeout.unref = false

test('reference-data/instruments/details', async ({ step }) => {
  using app = new SaxoBankApplication()

  for (const assetType of AssetTypeValues) {
    await step({
      name: assetType,
      async fn() {
        const instruments = await app.referenceData.instruments.details.get({ AssetTypes: [assetType] })

        try {
          expect(instruments).toBeDefined()
        } catch (error) {
          // deno-lint-ignore no-console
          console.log('instruments', instruments[0])

          throw error
        }

        const firstInstrument = instruments[0]

        if (firstInstrument !== undefined) {
          const instruments2 = await app.referenceData.instruments.details.get({
            AssetTypes: [assetType],
            Uics: [firstInstrument.Uic],
          })

          expect(instruments2).toBeDefined()
        }
      },
    })
  }
})
