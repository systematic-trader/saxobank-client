import { SaxoBankApplication } from '../../../../saxobank-application.ts'
import { test } from '../../../../testing.ts'

const SelectedAssetTypes = [
  'Bond',
  'CfdOnEtf',
  'ContractFutures',
  'Stock',
] as const

test('reference-data/instruments/tradingschedule', async ({ step }) => {
  using app = new SaxoBankApplication()

  const instruments = await Promise.all(SelectedAssetTypes.map((AssetType) =>
    app.referenceData.instruments.get({
      AssetTypes: [AssetType],
      limit: 100,
      IncludeNonTradable: true,
    })
  )).then((results) => results.flat().toSorted((left, right) => left.Identifier - right.Identifier))

  let count = 0

  for (const instrument of instruments) {
    await step({
      name:
        `${++count} / ${instruments.length}: Uic=${instrument.Identifier} Symbol=${instrument.Symbol}, ${instrument.Description}`,
      async fn() {
        await app.referenceData.instruments.tradingschedule.get({
          AssetType: instrument.AssetType,
          Uic: instrument.Identifier,
        })
      },
    })
  }
})
