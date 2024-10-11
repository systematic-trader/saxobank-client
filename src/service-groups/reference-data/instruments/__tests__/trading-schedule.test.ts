import { expect } from 'std/expect/mod.ts'
import { test } from 'std/testing/bdd.ts'
import { SaxoBankApplication } from '../../../../saxobank-application.ts'

test('reference-data/instruments/tradingschedule', async ({ step }) => {
  const { instruments: resource } = new SaxoBankApplication().referenceData

  const instruments = await resource.get({ AssetTypes: ['Stock'], limit: 25, IncludeNonTradable: false })

  let count = 0

  for (const instrument of instruments) {
    await step({
      name: `Uic=${instrument.Identifier} (${++count} / ${instruments.length})`,
      async fn() {
        const schedule = await resource.tradingschedule.get({ AssetType: 'Stock', Uic: instrument.Identifier })

        expect(schedule).toBeDefined()
      },
    })
  }
})
