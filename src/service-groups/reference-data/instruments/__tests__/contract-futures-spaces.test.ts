import { SaxoBankApplication } from '../../../../saxobank-application.ts'
import { expect, test } from '../../../../testing.ts'

test('reference-data/instruments/futuresspaces', async ({ step }) => {
  using app = new SaxoBankApplication()

  const instruments = await app.referenceData.instruments.get({ AssetTypes: ['ContractFutures'] })

  let count = 0

  for (const instrument of instruments) {
    await step({
      name: `Uic=${instrument.Identifier} (${++count} / ${instruments.length})`,
      async fn() {
        const spaces = await app.referenceData.instruments.futuresspaces.get({ Uic: instrument.Identifier })

        expect(spaces).toBeDefined()
      },
    })
  }
})
