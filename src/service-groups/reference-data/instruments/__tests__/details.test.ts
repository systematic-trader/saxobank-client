import { expect } from 'std/expect/mod.ts'
import { describe, test } from 'std/testing/bdd.ts'
import { SaxoBank24HourToken } from '../../../../authentication/saxobank-24-hour-token.ts'
import { SaxoBankClient } from '../../../../saxobank-client.ts'
import { AssetTypeValues } from '../../../../types/derives/asset-type.ts'

describe('reference-data/instruments/details', () => {
  const { details: resource } =
    new SaxoBankClient({ authorization: new SaxoBank24HourToken() }).referenceData.instruments

  for (const assetType of AssetTypeValues) {
    test(assetType, async () => {
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
    })
  }
})
