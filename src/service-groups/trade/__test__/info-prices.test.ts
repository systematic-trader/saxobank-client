import { expect } from 'std/expect/expect.ts'
import { describe, test } from 'std/testing/bdd.ts'
import { HTTPClientError } from '../../../http-client.ts'
import { SaxoBankApplication } from '../../../saxobank-application.ts'
import type { ContractOptionEntry } from '../../../types/records/contract-option-entry.ts'
import type { InfoPricesParameters } from '../info-prices.ts'

const MAXIMUM_INSTRUMENTS_PER_ASSET_TYPE = 500

function progress(current: number, total: number) {
  return `${String(current).padStart(String(total).length, '0')}/${total}`
}

function findSuitableOptionInstrument(optionSpaces: readonly ContractOptionEntry[]) {
  for (const optionSpace of optionSpaces) {
    for (const option of optionSpace.SpecificOptions ?? []) {
      return option
    }
  }

  return undefined
}

describe('trade/info-prices', () => {
  test('Getting info prices for asset type', async ({ step }) => {
    using app = new SaxoBankApplication()

    const assetTypeCandidates: InfoPricesParameters[keyof InfoPricesParameters]['AssetType'][] = [
      'Bond',
      'CfdOnIndex',
      'CompanyWarrant',
      'CfdOnCompanyWarrant',
      'Stock',
      'CfdOnStock',
      'StockIndexOption',
      'StockOption',
      'ContractFutures',
      'CfdOnFutures',
      'Etc',
      'CfdOnEtc',
      'Etf',
      'CfdOnEtf',
      'Etn',
      'CfdOnEtn',
      'Fund',
      'CfdOnFund',
      'FuturesOption',
      'FxForwards',
      'FxNoTouchOption',
      'FxOneTouchOption',
      'FxSpot',
      'FxSwap',
      'FxVanillaOption', // todo 8/47 of the instruments respond with an undocumented error - rewrite the test to use live data instead
      'Rights',
      'CfdOnRights',
    ] as const

    for (const assetType of assetTypeCandidates) {
      const instruments = await app.referenceData.instruments.get({
        AssetTypes: [assetType] as const,
        limit: MAXIMUM_INSTRUMENTS_PER_ASSET_TYPE,
      })

      await step(assetType, async ({ step }) => {
        let index = 0
        for (const instrument of instruments) {
          const label = `${
            progress(++index, instruments.length)
          }: ${instrument.Description} (UIC=${instrument.Identifier})`

          await step(label, async ({ step }) => {
            switch (assetType) {
              case 'Bond':
              case 'CfdOnCompanyWarrant':
              case 'CfdOnEtc':
              case 'CfdOnEtf':
              case 'CfdOnEtn':
              case 'CfdOnFund':
              case 'CfdOnFutures':
              case 'CfdOnIndex':
              case 'CfdOnRights':
              case 'CfdOnStock':
              case 'CompanyWarrant':
              case 'ContractFutures':
              case 'Etc':
              case 'Etf':
              case 'Etn':
              case 'Fund':
              case 'FxForwards':
              case 'FxSpot':
              case 'Rights':
              case 'Stock': {
                const infoPrices = await app.trade.infoPrices.get({
                  Amount: 80,
                  AssetType: assetType,
                  Uic: instrument.Identifier,
                })

                expect(infoPrices).toBeDefined()

                break
              }

              case 'FuturesOption':
              case 'StockOption':
              case 'StockIndexOption': {
                const optionsResponse = await app.referenceData.instruments.contractoptionspaces.get({
                  OptionRootId: instrument.Identifier,
                })

                if (optionsResponse === undefined || optionsResponse.OptionSpace === undefined) {
                  throw new Error(`Could not options for UIC=${instrument.Identifier}`)
                }

                const optionInstrument = findSuitableOptionInstrument(optionsResponse.OptionSpace)

                if (optionInstrument === undefined) {
                  throw new Error(`Could not find a suitable option for UIC=${instrument.Identifier}`)
                }

                try {
                  const infoPrices = await app.trade.infoPrices.get({
                    Amount: 80,
                    AssetType: assetType,
                    Uic: optionInstrument.Uic,
                  })

                  expect(infoPrices).toBeDefined()
                } catch (error) {
                  if (error instanceof HTTPClientError && error.statusCode === 404) {
                    // deno-lint-ignore no-console
                    console.log(`Could not get info prices for option UIC=${optionInstrument.Uic}`)

                    break
                  }

                  throw error
                }

                break
              }

              case 'FxNoTouchOption':
              case 'FxOneTouchOption': {
                const today = new Date()
                const expityDate = Date.UTC(today.getFullYear(), today.getMonth() + 2, 1)

                const infoPrices = await app.trade.infoPrices.get({
                  Amount: 80,
                  AssetType: assetType,
                  Uic: instrument.Identifier,
                  ExpiryDate: new Date(expityDate).toISOString(),
                })

                expect(infoPrices).toBeDefined()

                break
              }

              case 'FxSwap': {
                const today = new Date()
                const nearLeg = Date.UTC(today.getFullYear(), today.getMonth() + 2, 1)
                const farLeg = Date.UTC(today.getFullYear(), today.getMonth() + 3, 1)

                const infoPrices = await app.trade.infoPrices.get({
                  Amount: 80,
                  AssetType: assetType,
                  Uic: instrument.Identifier,
                  ForwardDateNearLeg: new Date(nearLeg).toISOString(),
                  ForwardDateFarLeg: new Date(farLeg).toISOString(),
                })

                expect(infoPrices).toBeDefined()

                break
              }

              case 'FxVanillaOption': {
                const today = new Date()
                const expityDate = Date.UTC(today.getFullYear(), today.getMonth() + 2, 1)

                for (const action of ['Call', 'Put'] as const) {
                  await step(action, async () => {
                    const infoPrices = await app.trade.infoPrices.get({
                      Amount: 80,
                      AssetType: assetType,
                      Uic: instrument.Identifier,
                      PutCall: action,
                      ExpiryDate: new Date(expityDate).toISOString(),
                    })

                    expect(infoPrices).toBeDefined()
                  })
                }

                break
              }
            }
          })
        }
      })
    }
  })
})
