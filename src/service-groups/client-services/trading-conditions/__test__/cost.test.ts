import { expect } from 'std/expect/expect.ts'
import { describe, test } from 'std/testing/bdd.ts'
import { SaxoBank24HourToken } from '../../../../authentication/saxobank-24-hour-token.ts'
import { SaxoBankClient } from '../../../../saxobank-client.ts'
import { extractEntries } from '../../../../utils.ts'
import type { CostParameters } from '../cost.ts'

describe.skip('client-services/trading-conditions/cost', () => {
  const saxoBankClient = new SaxoBankClient({
    prefixURL: 'https://gateway.saxobank.com/sim/openapi',
    authorization: new SaxoBank24HourToken(),
  })

  // todo rewrite this to be dynamic based on the instruments resource - as it is now, the tests will break over time as instruments are added/removed/changed
  test('Getting costs for asset type', async ({ step }) => {
    const [account] = await saxoBankClient.portfolio.accounts.me.get()
    if (account === undefined) {
      throw new Error('No account found')
    }

    const cases: Record<CostParameters['AssetType'], Record<string, { readonly Uic: number }>> = {
      Bond: {
        'Nykredit Realkredit 5% 01 Oct 2056, DKK': { Uic: 36413429 },
        'Germany 0% 10 Oct 2025, EUR': { Uic: 36938891 },
      },

      CfdOnIndex: {
        'Denmark 25': { Uic: 5889634 },
        'Germany Mid-Cap 50': { Uic: 31582 },
      },

      CompanyWarrant: {
        'STENOCARE A/S - Warrant': { Uic: 36067046 },
        'Valaris Ltd.': { Uic: 22736639 },
      },
      CfdOnCompanyWarrant: {
        'Diana Shipping Inc - Warrant': { Uic: 39509019 },
        'COMPAGNIE FINANCIERE RICHEMONT SA-WRT-Reduce Only': { Uic: 20278036 },
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

      StockIndexOption: {
        'AEX Index Weekly (1), call, 900': { Uic: 44496271 },
        'S&P 500 Mini Index, call, 525': { Uic: 44188457 },
        'Russell 2000 Index Weekly, call, 2170': { Uic: 44420715 },
      },

      StockOption: {
        'HSBC Holdings Plc., put, 600': { Uic: 33867285 },
        'Tesla Inc., call, 230': { Uic: 43857924 },
        'Apple Inc., call, 212.5': { Uic: 44412129 },
        'NVidia Corp., call, 106': { Uic: 43857409 },
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
        'WisdomTree Physical Palladium ETC': { Uic: 35346 },
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
        'Sprott Physical Uranium Trust': { Uic: 24116065 },
        'Sprott Physical Gold Trust': { Uic: 46813 },
        'Blackrock Sustainable American Income Trust PLC': { Uic: 24198883 },
      },

      FuturesOption: {
        'Silver, call 3025': { Uic: 41275840 },
        'E-Mini NASDAQ-100 End-of-Month, call 19100': { Uic: 43603807 },
      },

      FxForwards: {
        'Gold/US Dollar': { Uic: 8176 },
        'US Dollar/Japanese Yen': { Uic: 42 },
      },
      FxNoTouchOption: {
        'Euro/British Pound': { Uic: 17 },
        'US Dollar/Japanese Yen': { Uic: 42 },
      },
      FxOneTouchOption: {
        'Euro/British Pound': { Uic: 17 },
        'US Dollar/Japanese Yen': { Uic: 42 },
      },
      FxSpot: {
        'Gold/US Dollar': { Uic: 8176 },
        'US Dollar/Japanese Yen': { Uic: 42 },
      },
      FxSwap: {
        'Gold/US Dollar': { Uic: 8176 },
        'US Dollar/Japanese Yen': { Uic: 42 },
      },
      FxVanillaOption: {
        'Euro/British Pound': { Uic: 17 },
        'Gold/US Dollar': { Uic: 8176 },
        'US Dollar/Japanese Yen': { Uic: 42 },
      },

      Rights: {
        'Corporacion Financiera Alba SA - Rights': { Uic: 36115376 },
        'Spineguard - Rights': { Uic: 42828275 },
      },
      CfdOnRights: {
        'Wolford AG - Rights': { Uic: 33612435 },
        'LG Display Co. Ltd - ADR-  Rights': { Uic: 40142100 },
      },
    } as const

    const holdingPeriods = [0, 1, 7]

    for (const [AssetType, subcases] of extractEntries(cases)) {
      if (Object.keys(subcases).length === 0) {
        continue
      }

      await step(AssetType, async ({ step: substep }) => {
        for (const [caseLabel, { Uic }] of extractEntries(subcases)) {
          for (const holdingPeriod of holdingPeriods) {
            const periodLabel = holdingPeriod === 0 ? 'intraday' : `${holdingPeriod} days`
            const label = `${caseLabel} (${Uic}) - ${periodLabel}`

            await substep(label, async () => {
              const chart = await saxoBankClient.clientServices.tradingConditions.cost.get({
                AccountKey: account.AccountKey,
                Amount: 80,
                AssetType,
                Price: 58,
                Uic,
                HoldingPeriodInDays: holdingPeriod,
              })

              expect(chart).toBeDefined()
            })
          }
        }
      })
    }
  })
})
