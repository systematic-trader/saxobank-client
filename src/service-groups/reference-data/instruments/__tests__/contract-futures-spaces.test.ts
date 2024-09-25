import { expect } from 'std/expect/mod.ts'
import { test } from 'std/testing/bdd.ts'
import { SaxoBank24HourToken } from '../../../../authentication/saxobank-24-hour-token.ts'
import { SaxoBankClient } from '../../../../saxobank-client.ts'

test('reference-data/instruments/futuresspaces', async (context) => {
  const { instruments: resource } = new SaxoBankClient({ authorization: new SaxoBank24HourToken() }).referenceData

  const instruments = await resource.get({ AssetTypes: ['ContractFutures'] })

  let count = 0

  for (const instrument of instruments) {
    await context.step({
      name: `Uic=${instrument.Identifier} (${++count} / ${instruments.length})`,
      async fn() {
        const spaces = await resource.futuresspaces.get({ Uic: instrument.Identifier })

        expect(spaces).toBeDefined()
      },
    })
  }
})
