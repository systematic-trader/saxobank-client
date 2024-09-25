import { expect } from 'std/expect/mod.ts'
import { test } from 'std/testing/bdd.ts'
import { SaxoBank24HourToken } from '../../../../authentication/saxobank-24-hour-token.ts'
import { SaxoBankClient } from '../../../../saxobank-client.ts'

test('reference-data/instruments/tradingschedule', async (context) => {
  const { instruments: resource } = new SaxoBankClient({ authorization: new SaxoBank24HourToken() }).referenceData

  const instruments = await resource.get({ AssetTypes: ['Stock'], limit: 25, IncludeNonTradable: false })

  let count = 0

  for (const instrument of instruments) {
    await context.step({
      name: `Uic=${instrument.Identifier} (${++count} / ${instruments.length})`,
      async fn() {
        const schedule = await resource.tradingschedule.get({ AssetType: 'Stock', Uic: instrument.Identifier })

        expect(schedule).toBeDefined()
      },
    })
  }
})
