import { SaxoBankApplication } from '../../../../saxobank-application.ts'
import { expect, test } from '../../../../testing.ts'

test('reference-data/instruments/tradingschedule', async ({ step }) => {
  using app = new SaxoBankApplication()

  const instruments = await app.referenceData.instruments.get({
    AssetTypes: ['Stock'],
    limit: 25,
    IncludeNonTradable: false,
  })

  let count = 0

  for (const instrument of instruments) {
    await step({
      name: `Uic=${instrument.Identifier} (${++count} / ${instruments.length})`,
      async fn() {
        const schedule = await app.referenceData.instruments.tradingschedule.get({
          AssetType: 'Stock',
          Uic: instrument.Identifier,
        })

        expect(schedule).toBeDefined()
      },
    })
  }
})
