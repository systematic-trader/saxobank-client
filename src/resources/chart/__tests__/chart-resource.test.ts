import { expect } from 'std/expect/mod.ts'
import { describe, test } from 'std/testing/bdd.ts'
import type { ChartsParameters } from '../chart-resource.ts'
import { extractEntries } from '../../utils.ts'
import { SaxoBankClient } from '../../../../mod.ts'
import { SaxoBank24HourToken } from '../../../authentication/saxobank-24-hour-token.ts'

describe('ChartResource', () => {
  const saxoBankClient = new SaxoBankClient({
    prefixURL: 'https://gateway.saxobank.com/sim/openapi',
    authorization: new SaxoBank24HourToken(),
  })

  test('Getting chart data for asset type', async ({ step }) => {
    const cases: Record<ChartsParameters['assetType'], Record<string, { readonly uic: number }>> = {
      Bond: {
        'Nykredit Realkredit 5% 01 Oct 2056, DKK': { uic: 36413429 },
        'Germany 0% 10 Oct 2025, EUR': { uic: 36938891 },
      },

      CompanyWarrant: {
        'STENOCARE A/S - Warrant': { uic: 36067046 },
        'Valaris Ltd.': { uic: 22736639 },
      },
      CfdOnCompanyWarrant: {
        'Diana Shipping Inc - Warrant': { uic: 39509019 },
        'COMPAGNIE FINANCIERE RICHEMONT SA-WRT-Reduce Only': { uic: 20278036 },
      },

      ContractFutures: {
        'Gold - Aug 2025': { uic: 40758986 },
        'Light Sweet Crude Oil (WTI) - Dec 2027': { uic: 37393385 },
      },
      CfdOnFutures: {
        'UK 100 Index September 2024': { uic: 42694469 },
        'US Crude October 2024': { uic: 42754533 },
      },

      Etc: {
        'Global X Physical Gold ETC': { uic: 19357 },
        'WisdomTree WTI Crude Oil ETC': { uic: 35385 },
      },
      CfdOnEtc: {
        'Global X Physical Gold ETC': { uic: 19357 },
        'WisdomTree WTI Crude Oil ETC': { uic: 35385 },
      },

      Etf: {
        'VanEck Vectors Gold Miners ETF': { uic: 35663 },
        'iShares STOXX EU 600 Oil & Gas UCITS ETF (DE)': { uic: 39342 },
      },
      CfdOnEtf: {
        'VanEck Vectors Gold Miners ETF': { uic: 35663 },
        'iShares STOXX EU 600 Oil & Gas UCITS ETF (DE)': { uic: 39342 },
      },

      Etn: {
        'iPath Bloomberg Commodity Index Total Return ETN': { uic: 4692063 },
        'Ipath S&P VIX Short Term Future ETN': { uic: 13727743 },
      },
      CfdOnEtn: {
        'iPath Bloomberg Commodity Index Total Return ETN': { uic: 4692063 },
        'Ipath S&P VIX Short Term Future ETN': { uic: 13727743 },
      },

      Fund: {
        'North European Oil Royalty Trust': { uic: 54064 },
        'Sprott Physical Gold Trust': { uic: 46813 },
        'Alliance Trust Plc': { uic: 54064 },
      },
      CfdOnFund: {
        'North European Oil Royalty Trust': { uic: 54064 },
        'Sprott Physical Gold Trust': { uic: 46813 },
        'Alliance Trust Plc': { uic: 54064 },
      },

      FxSpot: {
        'Gold/US Dollar': { uic: 8176 },
        'US Dollar/Japanese Yen': { uic: 42 },
      },

      Rights: {
        'Corporacion Financiera Alba SA - Rights': { uic: 36115376 },
        'Spineguard - Rights': { uic: 42828275 },
      },
      CfdOnRights: {
        'Corporacion Financiera Alba SA - Rights': { uic: 36115376 },
        'Wolford AG - Rights': { uic: 33612435 },
        'LG Display Co. Ltd - ADR-  Rights': { uic: 40142100 },
      },

      Stock: {
        'Apple Inc.': { uic: 211 },
        'Tesla Inc.': { uic: 47556 },
        'NVIDIA Corp.': { uic: 1249 },
      },
      CfdOnStock: {
        'Apple Inc.': { uic: 211 },
        'Tesla Inc.': { uic: 47556 },
        'NVIDIA Corp.': { uic: 1249 },
      },

      StockIndex: {
        'NASDAQ Composite Index': { uic: 1376 },
        'OBX Oslo Index': { uic: 7940 },
        'Germany 40': { uic: 4910 },
      },
      CfdOnIndex: {
        'OBX Oslo Index': { uic: 7940 },
        'Germany 40': { uic: 4910 },
        'US 500': { uic: 4913 },
      },
    } as const

    for (const [assetType, subcases] of extractEntries(cases)) {
      if (Object.keys(subcases).length === 0) {
        continue
      }

      await step(assetType, async ({ step: substep }) => {
        for (const [label, { uic }] of extractEntries(subcases)) {
          await substep(label, async () => {
            const chart = await saxoBankClient.chart.charts({
              assetType,
              uic,
              horizon: 60,
              count: 3,
            })

            expect(chart).toBeDefined()
          })
        }
      })
    }
  })

  test('Getting bid/ask ohlc chart data for fx spot', async () => {
    const chart = await saxoBankClient.chart.charts({
      assetType: 'FxSpot',
      uic: 8176, // Gold/US Dollar
      horizon: 60,
      count: 1,
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
    const chart = await saxoBankClient.chart.charts({
      assetType: 'Stock',
      uic: 211, // Apple Inc.
      horizon: 60,
      count: 1,
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
