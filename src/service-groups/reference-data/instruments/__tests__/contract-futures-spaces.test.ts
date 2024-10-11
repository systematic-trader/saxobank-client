import { expect } from 'std/expect/mod.ts'
import { test } from 'std/testing/bdd.ts'
import { SaxoBankApplication } from '../../../../saxobank-application.ts'

test('reference-data/instruments/futuresspaces', async ({ step }) => {
  const { instruments: resource } = new SaxoBankApplication().referenceData

  const instruments = await resource.get({ AssetTypes: ['ContractFutures'] })

  let count = 0

  for (const instrument of instruments) {
    await step({
      name: `Uic=${instrument.Identifier} (${++count} / ${instruments.length})`,
      async fn() {
        const spaces = await resource.futuresspaces.get({ Uic: instrument.Identifier })

        expect(spaces).toBeDefined()
      },
    })
  }
})
