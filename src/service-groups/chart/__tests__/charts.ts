import { expect } from 'std/expect/mod.ts'
import { describe, test } from 'std/testing/bdd.ts'
import { SaxoBankClient } from '../../../../mod.ts'
import { SaxoBank24HourToken } from '../../../authentication/saxobank-24-hour-token.ts'
import { extractEntries } from '../../../utils.ts'
import type { ChartsParameters } from '../charts.ts'

describe('charts/chart', () => {
  const saxoBankClient = new SaxoBankClient({
    prefixURL: 'https://gateway.saxobank.com/sim/openapi',
    authorization: new SaxoBank24HourToken(),
  })

  test('Getting chart data for asset type', async ({ step }) => {
    const cases: Record<ChartsParameters['AssetType'], Record<string, { readonly Uic: number }>> = {
      Bond: {
        'Nykredit Realkredit 5% 01 Oct 2056, DKK': { Uic: 36413429 },
        'Germany 0% 10 Oct 2025, EUR': { Uic: 36938891 },
      },

      CompanyWarrant: {
        'STENOCARE A/S - Warrant': { Uic: 36067046 },
        'Valaris Ltd.': { Uic: 22736639 },
      },
      CfdOnCompanyWarrant: {
        'Diana Shipping Inc - Warrant': { Uic: 39509019 },
        'COMPAGNIE FINANCIERE RICHEMONT SA-WRT-Reduce Only': { Uic: 20278036 },
      },

      ContractFutures: {
        'Gold - Aug 2025': { Uic: 40758986 },
        'Light Sweet Crude Oil (WTI) - Dec 2027': { Uic: 37393385 },
      },
      CfdOnFutures: {
        'UK Crude January 2025': { Uic: 42445474 },
        'Platinum January 2025': { Uic: 42466309 },
      },

      Etc: {
        'Global X Physical Gold ETC': { Uic: 19357 },
        'WisdomTree WTI Crude Oil ETC': { Uic: 35385 },
      },
      CfdOnEtc: {
        'Global X Physical Gold ETC': { Uic: 19357 },
        'WisdomTree WTI Crude Oil ETC': { Uic: 35385 },
      },

      Etf: {
        'VanEck Vectors Gold Miners ETF': { Uic: 35663 },
        'iShares STOXX EU 600 Oil & Gas UCITS ETF (DE)': { Uic: 39342 },
      },
      CfdOnEtf: {
        'VanEck Vectors Gold Miners ETF': { Uic: 35663 },
        'iShares STOXX EU 600 Oil & Gas UCITS ETF (DE)': { Uic: 39342 },
      },

      Etn: {
        'iPath Bloomberg Commodity Index Total Return ETN': { Uic: 4692063 },
        'Ipath S&P VIX Short Term Future ETN': { Uic: 13727743 },
      },
      CfdOnEtn: {
        'iPath Bloomberg Commodity Index Total Return ETN': { Uic: 4692063 },
        'Ipath S&P VIX Short Term Future ETN': { Uic: 13727743 },
      },

      Fund: {
        'North European Oil Royalty Trust': { Uic: 54064 },
        'Sprott Physical Gold Trust': { Uic: 46813 },
        'Alliance Trust Plc': { Uic: 54064 },
      },
      CfdOnFund: {
        'North European Oil Royalty Trust': { Uic: 54064 },
        'Sprott Physical Gold Trust': { Uic: 46813 },
        'Alliance Trust Plc': { Uic: 54064 },
      },

      FxSpot: {
        'Gold/US Dollar': { Uic: 8176 },
        'US Dollar/Japanese Yen': { Uic: 42 },
      },

      Rights: {
        'Corporacion Financiera Alba SA - Rights': { Uic: 36115376 },
        'Spineguard - Rights': { Uic: 42828275 },
      },
      CfdOnRights: {
        'Corporacion Financiera Alba SA - Rights': { Uic: 36115376 },
        'Wolford AG - Rights': { Uic: 33612435 },
        'LG Display Co. Ltd - ADR-  Rights': { Uic: 40142100 },
      },

      Stock: {
        'Apple Inc.': { Uic: 211 },
        'Tesla Inc.': { Uic: 47556 },
        'NVIDIA Corp.': { Uic: 1249 },
      },
      CfdOnStock: {
        'Apple Inc.': { Uic: 211 },
        'Tesla Inc.': { Uic: 47556 },
        'NVIDIA Corp.': { Uic: 1249 },
      },

      StockIndex: {
        'NASDAQ Composite Index': { Uic: 1376 },
        'OBX Oslo Index': { Uic: 7940 },
        'Germany 40': { Uic: 4910 },
      },
      CfdOnIndex: {
        'OBX Oslo Index': { Uic: 7940 },
        'Germany 40': { Uic: 4910 },
        'US 500': { Uic: 4913 },
      },
    } as const

    for (const [AssetType, subcases] of extractEntries(cases)) {
      if (Object.keys(subcases).length === 0) {
        continue
      }

      await step(AssetType, async ({ step: substep }) => {
        for (const [label, { Uic }] of extractEntries(subcases)) {
          await substep(label, async () => {
            const chart = await saxoBankClient.chart.charts.get({
              AssetType,
              Uic,
              Horizon: 60,
              Count: 3,
            })

            expect(chart).toBeDefined()
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

    expect(typeof chart.Data[0]?.CloseAsk).toStrictEqual('number')
    expect(typeof chart.Data[0]?.CloseBid).toStrictEqual('number')
    expect(typeof chart.Data[0]?.HighAsk).toStrictEqual('number')
    expect(typeof chart.Data[0]?.HighBid).toStrictEqual('number')
    expect(typeof chart.Data[0]?.LowAsk).toStrictEqual('number')
    expect(typeof chart.Data[0]?.LowBid).toStrictEqual('number')
    expect(typeof chart.Data[0]?.OpenAsk).toStrictEqual('number')
    expect(typeof chart.Data[0]?.OpenBid).toStrictEqual('number')
    expect(typeof chart.Data[0]?.Time).toStrictEqual('string')
  })

  test('Getting ohlc chart data for stock', async () => {
    const chart = await saxoBankClient.chart.charts.get({
      AssetType: 'Stock',
      Uic: 211, // Apple Inc.
      Horizon: 60,
      Count: 1,
    })

    expect(typeof chart.Data[0]?.Close).toStrictEqual('number')
    expect(typeof chart.Data[0]?.High).toStrictEqual('number')
    expect(typeof chart.Data[0]?.Low).toStrictEqual('number')
    expect(typeof chart.Data[0]?.Open).toStrictEqual('number')
    expect(typeof chart.Data[0]?.Volume).toStrictEqual('number')
    expect(typeof chart.Data[0]?.Interest).toStrictEqual('number')
    expect(typeof chart.Data[0]?.Time).toStrictEqual('string')
  })
})
