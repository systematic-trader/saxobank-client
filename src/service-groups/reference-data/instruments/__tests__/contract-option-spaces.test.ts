import { SaxoBankApplication } from '../../../../saxobank-application.ts'
import { expect, test } from '../../../../testing.ts'
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
