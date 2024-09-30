import { expect } from 'std/expect/expect.ts'
import { describe, test } from 'std/testing/bdd.ts'
import { SaxoBank24HourToken } from '../../../authentication/saxobank-24-hour-token.ts'
import { SaxoBankClient } from '../../../saxobank-client.ts'
import { extractEntries } from '../../../utils.ts'
import type { InfoPricesBaseParameters } from '../info-prices.ts'

describe('trade/info-prices', () => {
  const saxoBankClient = new SaxoBankClient({
    prefixURL: 'https://gateway.saxobank.com/sim/openapi',
    authorization: new SaxoBank24HourToken(),
  })

  // todo rewrite this to be dynamic based on the instruments resource - as it is now, the tests will break over time as instruments are added/removed/changed
  test('Getting info proces for asset type', async ({ step }) => {
    const cases: Record<InfoPricesBaseParameters['AssetType'], Record<string, { readonly Uic: number }>> = {
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
        'S&P 500 Mini Index, put, 330': { Uic: 42872592 },
        'Russell 2000 Index Weekly, put, 1000': { Uic: 43078012 },
      },

      StockOption: {
        'HSBC Holdings Plc., put, 41': { Uic: 40895356 },
        'Tesla Inc., call, 125': { Uic: 33057973 },
        'Apple Inc., call, 145': { Uic: 31234008 },
        'NVidia Corp., call, 59.5': { Uic: 42668317 },
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
        'Silver, call 1725': { Uic: 36945048 },
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

    for (const [AssetType, subcases] of extractEntries(cases)) {
      if (Object.keys(subcases).length === 0) {
        continue
      }

      await step(AssetType, async ({ step: substep }) => {
        for (const [caseLabel, { Uic }] of extractEntries(subcases)) {
          const label = `${caseLabel} (${Uic})`

          switch (AssetType) {
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
            case 'FuturesOption':
            case 'FxForwards':
            case 'FxSpot':
            case 'Rights':
            case 'Stock':
            case 'StockIndexOption':
            case 'StockOption': {
              await substep(label, async () => {
                const infoPrices = await saxoBankClient.trade.infoPrices.get({
                  Amount: 80,
                  AssetType,
                  Uic,
                })

                expect(infoPrices).toBeDefined()
              })

              break
            }

            case 'FxNoTouchOption':
            case 'FxOneTouchOption': {
              const today = new Date()
              const expityDate = Date.UTC(today.getFullYear(), today.getMonth() + 2, 1)

              await substep(label, async () => {
                const infoPrices = await saxoBankClient.trade.infoPrices.get({
                  Amount: 80,
                  AssetType,
                  Uic,
                  ExpiryDate: new Date(expityDate).toISOString(),
                })

                expect(infoPrices).toBeDefined()
              })

              break
            }

            case 'FxSwap': {
              const today = new Date()
              const nearLeg = Date.UTC(today.getFullYear(), today.getMonth() + 2, 1)
              const farLeg = Date.UTC(today.getFullYear(), today.getMonth() + 3, 1)

              await substep(label, async () => {
                const infoPrices = await saxoBankClient.trade.infoPrices.get({
                  Amount: 80,
                  AssetType,
                  Uic,
                  ForwardDateNearLeg: new Date(nearLeg).toISOString(),
                  ForwardDateFarLeg: new Date(farLeg).toISOString(),
                })

                expect(infoPrices).toBeDefined()
              })

              break
            }

            case 'FxVanillaOption': {
              const today = new Date()
              const expityDate = Date.UTC(today.getFullYear(), today.getMonth() + 2, 1)

              for (const action of ['Call', 'Put'] as const) {
                await substep(`${action}: ${label}`, async () => {
                  const infoPrices = await saxoBankClient.trade.infoPrices.get({
                    Amount: 80,
                    AssetType,
                    Uic,
                    PutCall: action,
                    ExpiryDate: new Date(expityDate).toISOString(),
                  })

                  expect(infoPrices).toBeDefined()
                })
              }

              break
            }
          }
        }
      })
    }
  })
})
