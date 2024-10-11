import { test } from 'std/testing/bdd.ts'
import { SaxoBankApplication } from '../../../../saxobank-application.ts'
import { OptionAssetTypeValues } from '../../../../types/records/option-details.ts'

test('reference-data/instruments/contractoptionspaces', async ({ step }) => {
  const { instruments } = new SaxoBankApplication().referenceData

  const optionsInstruments = await instruments.get({ AssetTypes: OptionAssetTypeValues })

  let count = 0

  for (const optionInstrument of optionsInstruments) {
    await step({
      name: `Uic=${optionInstrument.Identifier}  (${++count} / ${optionsInstruments.length})`,
      async fn() {
        await instruments.contractoptionspaces.get({ OptionRootId: optionInstrument.Identifier })
      },
    })
  }
})
