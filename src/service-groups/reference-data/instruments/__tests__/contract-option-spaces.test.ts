import { expect } from 'std/expect/expect.ts'
import { test } from 'std/testing/bdd.ts'
import { SaxoBankApplication } from '../../../../saxobank-application.ts'
import { OptionAssetTypeValues } from '../../../../types/records/option-details.ts'

test('reference-data/instruments/contractoptionspaces', async ({ step }) => {
  using app = new SaxoBankApplication()

  const optionsInstruments = await app.referenceData.instruments.get({ AssetTypes: OptionAssetTypeValues })

  let count = 0

  for (const optionInstrument of optionsInstruments) {
    await step({
      name: `Uic=${optionInstrument.Identifier}  (${++count} / ${optionsInstruments.length})`,
      async fn() {
        const spaces = await app.referenceData.instruments.contractoptionspaces.get({
          OptionRootId: optionInstrument.Identifier,
        })

        expect(spaces).toBeDefined()
      },
    })
  }
})
