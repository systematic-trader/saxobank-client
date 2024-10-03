import { expect } from 'std/expect/mod.ts'
import { describe, test } from 'std/testing/bdd.ts'
import { SaxoBankClient } from '../../../../mod.ts'
import { SaxoBank24HourToken } from '../../../authentication/saxobank-24-hour-token.ts'
import { HTTPClientError } from '../../../http-client.ts'
import type { ChartsParameters } from '../charts.ts'

const MAXIMUM_INSTRUMENTS_PER_ASSET_TYPE = 250

function progress(current: number, total: number) {
  return `${String(current).padStart(String(total).length, '0')}/${total}`
}

describe('chart/charts', () => {
  const saxoBankClient = new SaxoBankClient({
    prefixURL: 'https://gateway.saxobank.com/sim/openapi',
    authorization: new SaxoBank24HourToken(),
  })

  test('Getting chart data for asset type', async ({ step }) => {
    const assetTypeCandidates: ChartsParameters['AssetType'][] = [
      'Bond',
      'CfdOnCompanyWarrant',
      'CfdOnEtc',
      'CfdOnEtf',
      'CfdOnEtn',
      'CfdOnFund',
      'CfdOnFutures',
      'CfdOnIndex',
      'CfdOnRights',
      'CfdOnStock',
      'CompanyWarrant',
      'ContractFutures',
      'Etc',
      'Etf',
      'Etn',
      'Fund',
      'FxSpot',
      'Rights',
      'Stock',
      'StockIndex',
    ] as const

    for (const assetType of assetTypeCandidates) {
      const instruments = await saxoBankClient.referenceData.instruments.get({
        AssetTypes: [assetType] as const,
        limit: MAXIMUM_INSTRUMENTS_PER_ASSET_TYPE,
      })

      await step(assetType, async ({ step: substep }) => {
        let index = 0
        for (const instrument of instruments) {
          const label = `${
            progress(++index, instruments.length)
          }: ${instrument.Description} (UIC=${instrument.Identifier})`

          await substep(label, async () => {
            try {
              const chart = await saxoBankClient.chart.charts.get({
                AssetType: assetType,
                Uic: instrument.Identifier,
                Horizon: 60,
                Count: 3,
              })

              expect(chart).toBeDefined()
            } catch (error) {
              if (error instanceof HTTPClientError && error.statusCode === 403) {
                // deno-lint-ignore no-console
                console.log(`No access to charts for UIC=${instrument.Identifier} (skipping)`)
                return
              }

              throw error
            }
          })
        }
      })
    }
  })

  test('Getting bid/ask ohlc chart data for fx spot', async () => {
    const chart = await saxoBankClient.chart.charts.get({
      AssetType: 'FxSpot',
      Uic: 8176, // Gold/US Dollar
      Horizon: 60,
      Count: 1,
    })

    expect(typeof chart.Data?.[0]?.CloseAsk).toStrictEqual('number')
    expect(typeof chart.Data?.[0]?.CloseBid).toStrictEqual('number')
    expect(typeof chart.Data?.[0]?.HighAsk).toStrictEqual('number')
    expect(typeof chart.Data?.[0]?.HighBid).toStrictEqual('number')
    expect(typeof chart.Data?.[0]?.LowAsk).toStrictEqual('number')
    expect(typeof chart.Data?.[0]?.LowBid).toStrictEqual('number')
    expect(typeof chart.Data?.[0]?.OpenAsk).toStrictEqual('number')
    expect(typeof chart.Data?.[0]?.OpenBid).toStrictEqual('number')
    expect(typeof chart.Data?.[0]?.Time).toStrictEqual('string')
  })

  test('Getting ohlc chart data for stock', async () => {
    const chart = await saxoBankClient.chart.charts.get({
      AssetType: 'Stock',
      Uic: 211, // Apple Inc.
      Horizon: 60,
      Count: 1,
    })

    expect(typeof chart.Data?.[0]?.Close).toStrictEqual('number')
    expect(typeof chart.Data?.[0]?.High).toStrictEqual('number')
    expect(typeof chart.Data?.[0]?.Low).toStrictEqual('number')
    expect(typeof chart.Data?.[0]?.Open).toStrictEqual('number')
    expect(typeof chart.Data?.[0]?.Volume).toStrictEqual('number')
    expect(typeof chart.Data?.[0]?.Interest).toStrictEqual('number')
    expect(typeof chart.Data?.[0]?.Time).toStrictEqual('string')
  })
})
