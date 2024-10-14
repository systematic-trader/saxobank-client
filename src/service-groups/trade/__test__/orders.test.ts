import { SaxoBankApplication } from '../../../saxobank-application.ts'
import { afterAll, beforeEach, describe, expect, test } from '../../../utils/testing.ts'
import type { InfoPricesParameters } from '../info-prices.ts'

// todo write tests for different order types (can probably be simple entry orders)
// todo write some tests that result in errors (e.g. wrong side of market + wrong duration etc)
// todo test long/short

const MAXIMUM_INSTRUMENTS_PER_ASSET_TYPE = 6

function roundPrice(price: number, tickSize: number) {
  return Math.round(price / tickSize) * tickSize
}

async function findSuiteablePrice({ app, assetType, uic }: {
  readonly app: SaxoBankApplication
  readonly assetType: keyof InfoPricesParameters
  readonly uic: number
  readonly delta?: undefined | number
}) {
  const infoPrice = await app.trade.infoPrices.get({
    AssetType: assetType,
    Uic: uic,
  })

  const bid = infoPrice.Quote.Bid
  if (bid === undefined) {
    throw new Error(`Could not determine bid price for ${assetType} ${uic}`)
  }

  const ask = infoPrice.Quote.Ask
  if (ask === undefined) {
    throw new Error(`Could not determine ask price for ${assetType} ${uic}`)
  }

  if (assetType !== 'FxSpot') {
    throw new Error('Sikke noget!') // todo
  }

  const [instrument] = await app.referenceData.instruments.details.get({
    AssetTypes: [assetType],
    Uics: [uic],
  })
  if (instrument === undefined) {
    throw new Error(`Could not determine instrument for ${assetType} ${uic}`)
  }

  // console.log("infoPrice", infoPrice)
  // console.log('instrument', instrument)

  const basis = infoPrice.Quote.Bid ?? infoPrice.Quote.Ask ?? infoPrice.Quote.Mid
  if (basis === undefined) {
    throw new Error(`Could not determine price basis for ${assetType} ${uic}`)
  }

  function adjust(basis: 'bid' | 'ask', ticks: number) {
    const priceBasis = basis === 'bid' ? bid : ask

    if (priceBasis === undefined) {
      throw new Error(`${basis} price is not defined`)
    }

    if (instrument === undefined) {
      throw new Error(`Could not determine instrument for ${assetType} ${uic}`)
    }

    return roundPrice(priceBasis + ticks * instrument.TickSize, instrument.TickSize)
  }

  return {
    bid,
    ask,
    adjust,
  }
}

function calculateMinimumAmount({ LotSize, MinimumLotSize }: {
  readonly LotSize?: undefined | number
  readonly MinimumLotSize?: undefined | number
}) {
  return Math.max(1, LotSize ?? 0, MinimumLotSize ?? 0)
}

describe('trade/orders', () => {
  using app = new SaxoBankApplication({
    type: 'Simulation',
  })

  async function resetAccount({
    // Some bonds are quite expensive, so we need to set a high balance to be able to place those orders
    balance = 10_000_000,
  }: { balance?: undefined | number } = {}) {
    // wait a while to not run into rate limit issues // todo remove this when 429-handling is implemented
    await new Promise((resolve) => setTimeout(resolve, 6_200))

    await app.resetAccount({ balance })
  }

  beforeEach(resetAccount)

  afterAll(resetAccount)

  describe('placing orders using different methods', () => {
    test('Method 1: Placing a single order, with no related orders', async () => {
      const placeOrderResponse = await app.trade.orders.post({
        RequestId: crypto.randomUUID(),

        AssetType: 'FxSpot',
        Uic: 21,
        BuySell: 'Buy',
        Amount: 50_000,
        ManualOrder: false,
        ExternalReference: crypto.randomUUID(),
        OrderType: 'Market',
        OrderDuration: {
          DurationType: 'DayOrder',
        },
      })

      expect(placeOrderResponse).toBeDefined()
    })

    test('Method 2: Placing a single order, with one related order', async () => {
      const price = await findSuiteablePrice({
        app,
        assetType: 'FxSpot',
        uic: 21,
      })

      const placeOrderResponse = await app.trade.orders.post({
        RequestId: crypto.randomUUID(),

        AssetType: 'FxSpot',
        Uic: 21,
        BuySell: 'Buy',
        Amount: 50_000,
        ManualOrder: false,
        ExternalReference: crypto.randomUUID(),
        OrderType: 'Market',
        OrderDuration: {
          DurationType: 'DayOrder',
        },

        Orders: [{
          AssetType: 'FxSpot',
          Uic: 21,
          BuySell: 'Sell',
          Amount: 50_000,
          ManualOrder: false,
          ExternalReference: crypto.randomUUID(),
          OrderType: 'Limit',
          OrderPrice: price.adjust('ask', 100),
          OrderDuration: {
            DurationType: 'GoodTillCancel',
          },
        }],
      })

      expect(placeOrderResponse).toBeDefined()
    })

    test('Method 3: Placing a single order, with two related orders', async () => {
      const price = await findSuiteablePrice({
        app,
        assetType: 'FxSpot',
        uic: 21,
      })

      const placeOrderResponse = await app.trade.orders.post({
        RequestId: crypto.randomUUID(),

        AssetType: 'FxSpot',
        Uic: 21,
        BuySell: 'Buy',
        Amount: 50_000,
        ManualOrder: false,
        ExternalReference: crypto.randomUUID(),
        OrderType: 'Market',
        OrderDuration: {
          DurationType: 'DayOrder',
        },

        Orders: [{
          AssetType: 'FxSpot',
          Uic: 21,
          BuySell: 'Sell',
          Amount: 50_000,
          ManualOrder: false,
          ExternalReference: crypto.randomUUID(),
          OrderType: 'Limit',
          OrderPrice: price.adjust('ask', 20),
          OrderDuration: {
            DurationType: 'GoodTillCancel',
          },
        }, {
          AssetType: 'FxSpot',
          Uic: 21,
          BuySell: 'Sell',
          Amount: 50_000,
          ManualOrder: false,
          ExternalReference: crypto.randomUUID(),
          OrderType: 'Stop',
          OrderPrice: price.adjust('bid', -20),
          OrderDuration: {
            DurationType: 'GoodTillCancel',
          },
        }],
      })

      expect(placeOrderResponse).toBeDefined()
    })

    test('Method 4: Placing a single related order to an existing order', async () => {
      const price = await findSuiteablePrice({
        app,
        assetType: 'FxSpot',
        uic: 21,
      })

      // First, place the initial entry order
      const entryOrderResponse = await app.trade.orders.post({
        RequestId: crypto.randomUUID(),

        AssetType: 'FxSpot',
        Uic: 21,
        BuySell: 'Buy',
        Amount: 50_000,
        ManualOrder: false,
        ExternalReference: crypto.randomUUID(),
        OrderType: 'Limit',
        OrderPrice: price.adjust('bid', -20),
        OrderDuration: {
          DurationType: 'DayOrder',
        },
      })

      expect(entryOrderResponse).toBeDefined()

      // After this, add a related order to the newly created order
      const relatedOrderResponse = await app.trade.orders.post({
        RequestId: crypto.randomUUID(),

        OrderId: entryOrderResponse.OrderId,

        Orders: [{
          AssetType: 'FxSpot',
          Uic: 21,
          BuySell: 'Sell',
          Amount: 50_000,
          ManualOrder: false,
          ExternalReference: crypto.randomUUID(),
          OrderType: 'Limit',
          OrderPrice: price.adjust('ask', 20),
          OrderDuration: {
            DurationType: 'GoodTillCancel',
          },
        }],
      })

      expect(relatedOrderResponse).toBeDefined()
    })

    test('Method 5: Placing two related orders to an existing order', async () => {
      const price = await findSuiteablePrice({
        app,
        assetType: 'FxSpot',
        uic: 21,
      })

      // First, place the initial entry order
      const entryOrderResponse = await app.trade.orders.post({
        RequestId: crypto.randomUUID(),

        AssetType: 'FxSpot',
        Uic: 21,
        BuySell: 'Buy',
        Amount: 50_000,
        ManualOrder: false,
        ExternalReference: crypto.randomUUID(),
        OrderType: 'Limit',
        OrderPrice: price.adjust('bid', -20),
        OrderDuration: {
          DurationType: 'DayOrder',
        },
      })

      expect(entryOrderResponse).toBeDefined()

      // After this, add a related order to the newly created order
      const relatedOrderResponse = await app.trade.orders.post({
        RequestId: crypto.randomUUID(),

        OrderId: entryOrderResponse.OrderId,

        Orders: [{
          AssetType: 'FxSpot',
          Uic: 21,
          BuySell: 'Sell',
          Amount: 50_000,
          ManualOrder: false,
          ExternalReference: crypto.randomUUID(),
          OrderType: 'Limit',
          OrderPrice: price.adjust('ask', 20),
          OrderDuration: {
            DurationType: 'GoodTillCancel',
          },
        }, {
          AssetType: 'FxSpot',
          Uic: 21,
          BuySell: 'Sell',
          Amount: 50_000,
          ManualOrder: false,
          ExternalReference: crypto.randomUUID(),
          OrderType: 'Stop',
          OrderPrice: price.adjust('bid', -40),
          OrderDuration: {
            DurationType: 'GoodTillCancel',
          },
        }],
      })

      expect(relatedOrderResponse).toBeDefined()
    })

    test('Method 6: Placing a single related order to an existing position', async () => {
      // todo implement this
    })

    test('Method 7: Placing two related orders to an existing position', async () => {
      // todo implement this
    })

    test('Method 8: Placing two orders that are OCO (One Cancels Other) orders.', async () => {
      const price = await findSuiteablePrice({
        app,
        assetType: 'FxSpot',
        uic: 21,
      })

      const placeOrderResponse = await app.trade.orders.post({
        RequestId: crypto.randomUUID(),

        Orders: [{
          AssetType: 'FxSpot',
          Uic: 21,
          BuySell: 'Buy',
          Amount: 50_000,
          ManualOrder: false,
          ExternalReference: crypto.randomUUID(),
          OrderType: 'Limit',
          OrderPrice: price.adjust('bid', -20),
          OrderDuration: {
            DurationType: 'GoodTillCancel',
          },
        }, {
          AssetType: 'FxSpot',
          Uic: 21,
          BuySell: 'Buy',
          Amount: 50_000,
          ManualOrder: false,
          ExternalReference: crypto.randomUUID(),
          OrderType: 'Stop',
          OrderPrice: price.adjust('ask', 20),
          OrderDuration: {
            DurationType: 'GoodTillCancel',
          },
        }],
      })

      expect(placeOrderResponse).toBeDefined()
    })
  })

  describe('placing orders with different duration', () => {
    test('AtTheClose', () => {
      // todo I'm unable to find any instruments that support this
    })

    test('AtTheOpening', () => {
      // todo I'm unable to find any instruments that support this
    })

    test('DayOrder', async () => {
      const price = await findSuiteablePrice({
        app,
        assetType: 'FxSpot',
        uic: 21,
      })

      const placeOrderResponse = await app.trade.orders.post({
        RequestId: crypto.randomUUID(),

        AssetType: 'FxSpot',
        Uic: 21,
        BuySell: 'Buy',
        Amount: 50_000,
        ManualOrder: false,
        ExternalReference: crypto.randomUUID(),
        OrderType: 'Limit',
        OrderPrice: price.adjust('ask', 20),
        OrderDuration: {
          DurationType: 'DayOrder',
        },
      })

      expect(placeOrderResponse).toBeDefined()
    })

    test('FillOrKill', async () => {
      const placeOrderResponse = await app.trade.orders.post({
        RequestId: crypto.randomUUID(),

        AssetType: 'Bond',
        Uic: 17642865, // United States of America 1.25% 15 May 2050, USD
        BuySell: 'Buy',
        Amount: 50_000,
        ManualOrder: false,
        ExternalReference: crypto.randomUUID(),
        OrderType: 'Market',
        OrderDuration: {
          DurationType: 'FillOrKill',
        },
      })

      expect(placeOrderResponse).toBeDefined()
    })

    test('GoodForPeriod', () => {
      // todo I'm unable to find any instruments that support this
    })

    test('GoodTillCancel', async () => {
      const price = await findSuiteablePrice({
        app,
        assetType: 'FxSpot',
        uic: 21,
      })

      const placeOrderResponse = await app.trade.orders.post({
        RequestId: crypto.randomUUID(),

        AssetType: 'FxSpot',
        Uic: 21,
        BuySell: 'Buy',
        Amount: 50_000,
        ManualOrder: false,
        ExternalReference: crypto.randomUUID(),
        OrderType: 'Limit',
        OrderPrice: price.adjust('ask', 20),
        OrderDuration: {
          DurationType: 'GoodTillCancel',
        },
      })

      expect(placeOrderResponse).toBeDefined()
    })

    test('GoodTillDate', async ({ step }) => {
      const today = new Date()
      const nextYear = today.getFullYear() + 1

      const price = await findSuiteablePrice({
        app,
        assetType: 'FxSpot',
        uic: 21,
      })

      const testCases = [
        { ExpirationDateContainsTime: true, ExpirationTime: '00:00' },
        { ExpirationDateContainsTime: true, ExpirationTime: '00:37' },
        { ExpirationDateContainsTime: true, ExpirationTime: '12:00' },
        { ExpirationDateContainsTime: true, ExpirationTime: '12:37' },
        { ExpirationDateContainsTime: true, ExpirationTime: '12:37:00' },
        { ExpirationDateContainsTime: true, ExpirationTime: '12:37:00.000' },
        { ExpirationDateContainsTime: false, ExpirationTime: undefined },
        { ExpirationDateContainsTime: false, ExpirationTime: '00:00' },
        { ExpirationDateContainsTime: false, ExpirationTime: '00:00:00' },
        { ExpirationDateContainsTime: false, ExpirationTime: '00:00:00.000' },
      ] as const

      for (const testCase of testCases) {
        await step(
          `ExpirationDateContainsTime=${testCase.ExpirationDateContainsTime}, ExpirationTime=${testCase.ExpirationTime}`,
          async () => {
            const expirationDate = `${nextYear}-01-01`
            const expirationDateTime = testCase.ExpirationTime === undefined
              ? expirationDate
              : [expirationDate, testCase.ExpirationTime].join('T')

            const placeOrderResponse = await app.trade.orders.post({
              RequestId: crypto.randomUUID(),

              AssetType: 'FxSpot',
              Uic: 21,
              BuySell: 'Buy',
              Amount: 50_000,
              ManualOrder: false,
              ExternalReference: crypto.randomUUID(),
              OrderType: 'Limit',
              OrderPrice: price.adjust('ask', 20),
              OrderDuration: {
                DurationType: 'GoodTillDate',
                ExpirationDateContainsTime: testCase.ExpirationDateContainsTime,
                ExpirationDateTime: expirationDateTime,
              },
            })

            expect(placeOrderResponse).toBeDefined()

            await resetAccount()
          },
        )
      }
    })

    test('ImmediateOrCancel', async () => {
      // Wait for a bit to avoid "Repeated trade on auto quote"-errors
      await new Promise((resolve) => setTimeout(resolve, 15_000))

      const price = await findSuiteablePrice({
        app,
        assetType: 'FxSpot',
        uic: 21,
      })

      const placeOrderResponse = await app.trade.orders.post({
        RequestId: crypto.randomUUID(),

        AssetType: 'FxSpot',
        Uic: 21,
        BuySell: 'Buy',
        Amount: 50_000,
        ManualOrder: false,
        ExternalReference: crypto.randomUUID(),
        OrderType: 'Limit',
        OrderPrice: price.adjust('ask', 20),
        OrderDuration: {
          DurationType: 'ImmediateOrCancel',
        },
      })

      expect(placeOrderResponse).toBeDefined()
    })
  })

  describe('placing orders for different asset types', () => {
    // todo ensure that these are all valid asset types

    test('Bond', async ({ step }) => {
      const instruments = await app.referenceData.instruments.get({
        AssetTypes: ['Bond'],
        limit: MAXIMUM_INSTRUMENTS_PER_ASSET_TYPE,
      })

      for (const instrument of instruments) {
        await step(instrument.Description, async () => {
          const [instrumentDetails] = await app.referenceData.instruments.details.get({
            AssetTypes: ['Bond'],
            Uics: [instrument.Identifier],
          })
          if (instrumentDetails === undefined) {
            throw new Error(`Could not determine details for ${instrument.Description} (UIC=${instrument.Identifier})`)
          }

          const placeOrderResponse = await app.trade.orders.post({
            RequestId: crypto.randomUUID(),

            AssetType: 'Bond',
            Uic: instrument.Identifier,
            BuySell: 'Buy',
            Amount: calculateMinimumAmount(instrumentDetails),
            ManualOrder: false,
            ExternalReference: crypto.randomUUID(),
            OrderType: 'Market',
            OrderDuration: {
              DurationType: 'DayOrder',
            },
          })

          expect(placeOrderResponse).toBeDefined()
        })

        await resetAccount()
      }
    })

    test('CfdOnIndex', async ({ step }) => {
      const instruments = await app.referenceData.instruments.get({
        AssetTypes: ['CfdOnIndex'],
        limit: MAXIMUM_INSTRUMENTS_PER_ASSET_TYPE,
      })

      for (const instrument of instruments) {
        await step(instrument.Description, async () => {
          const [instrumentDetails] = await app.referenceData.instruments.details.get({
            AssetTypes: ['CfdOnIndex'],
            Uics: [instrument.Identifier],
          })
          if (instrumentDetails === undefined) {
            throw new Error(`Could not determine details for ${instrument.Description} (UIC=${instrument.Identifier})`)
          }

          const placeOrderResponse = await app.trade.orders.post({
            RequestId: crypto.randomUUID(),

            AssetType: 'CfdOnIndex',
            Uic: instrument.Identifier,
            BuySell: 'Buy',
            Amount: calculateMinimumAmount(instrumentDetails),
            ManualOrder: false,
            ExternalReference: crypto.randomUUID(),
            OrderType: 'Market',
            OrderDuration: {
              DurationType: 'DayOrder',
            },
          })

          expect(placeOrderResponse).toBeDefined()
        })

        await resetAccount()
      }
    })

    test('CompanyWarrant', async ({ step }) => {
      const instruments = await app.referenceData.instruments.get({
        AssetTypes: ['CompanyWarrant'],
        limit: MAXIMUM_INSTRUMENTS_PER_ASSET_TYPE,
      })

      for (const instrument of instruments) {
        await step(instrument.Description, async () => {
          const [instrumentDetails] = await app.referenceData.instruments.details.get({
            AssetTypes: ['CompanyWarrant'],
            Uics: [instrument.Identifier],
          })
          if (instrumentDetails === undefined) {
            throw new Error(`Could not determine details for ${instrument.Description} (UIC=${instrument.Identifier})`)
          }

          const placeOrderResponse = await app.trade.orders.post({
            RequestId: crypto.randomUUID(),

            AssetType: 'CompanyWarrant',
            Uic: instrument.Identifier,
            BuySell: 'Buy',
            Amount: calculateMinimumAmount(instrumentDetails),
            ManualOrder: false,
            ExternalReference: crypto.randomUUID(),
            OrderType: 'Market',
            OrderDuration: {
              DurationType: 'DayOrder',
            },
          })

          expect(placeOrderResponse).toBeDefined()
        })

        await resetAccount()
      }
    })

    test('CfdOnCompanyWarrant', () => {
      // todo
    })

    test('Stock', async ({ step }) => {
      const instruments = await app.referenceData.instruments.get({
        AssetTypes: ['Stock'],
        limit: MAXIMUM_INSTRUMENTS_PER_ASSET_TYPE,
      })

      for (const instrument of instruments) {
        await step(instrument.Description, async () => {
          const [instrumentDetails] = await app.referenceData.instruments.details.get({
            AssetTypes: ['Stock'],
            Uics: [instrument.Identifier],
          })
          if (instrumentDetails === undefined) {
            throw new Error(`Could not determine details for ${instrument.Description} (UIC=${instrument.Identifier})`)
          }

          const placeOrderResponse = await app.trade.orders.post({
            RequestId: crypto.randomUUID(),

            AssetType: 'Stock',
            Uic: instrument.Identifier,
            BuySell: 'Buy',
            Amount: calculateMinimumAmount(instrumentDetails),
            ManualOrder: false,
            ExternalReference: crypto.randomUUID(),
            OrderType: 'Market',
            OrderDuration: {
              DurationType: 'DayOrder',
            },
          })

          expect(placeOrderResponse).toBeDefined()
        })

        await resetAccount()
      }
    })

    test('CfdOnStock', async ({ step }) => {
      const instruments = await app.referenceData.instruments.get({
        AssetTypes: ['CfdOnStock'],
        limit: MAXIMUM_INSTRUMENTS_PER_ASSET_TYPE,
      })

      for (const instrument of instruments) {
        await step(instrument.Description, async () => {
          const [instrumentDetails] = await app.referenceData.instruments.details.get({
            AssetTypes: ['CfdOnStock'],
            Uics: [instrument.Identifier],
          })
          if (instrumentDetails === undefined) {
            throw new Error(`Could not determine details for ${instrument.Description} (UIC=${instrument.Identifier})`)
          }

          const placeOrderResponse = await app.trade.orders.post({
            RequestId: crypto.randomUUID(),

            AssetType: 'CfdOnStock',
            Uic: instrument.Identifier,
            BuySell: 'Buy',
            Amount: calculateMinimumAmount(instrumentDetails),
            ManualOrder: false,
            ExternalReference: crypto.randomUUID(),
            OrderType: 'Market',
            OrderDuration: {
              DurationType: 'DayOrder',
            },
          })

          expect(placeOrderResponse).toBeDefined()
        })

        await resetAccount()
      }
    })

    test('StockIndexOption', () => {
      // todo
    })

    test('StockOption', () => {
      // todo
    })

    test.only('ContractFutures', async ({ step }) => {
      const instruments = await app.referenceData.instruments.get({
        AssetTypes: ['ContractFutures'],
        limit: MAXIMUM_INSTRUMENTS_PER_ASSET_TYPE,
      })

      for (const instrument of instruments) {
        await step(instrument.Description, async () => {
          const [instrumentDetails] = await app.referenceData.instruments.details.get({
            AssetTypes: ['ContractFutures'],
            Uics: [instrument.Identifier],
          })
          if (instrumentDetails === undefined) {
            throw new Error(`Could not determine details for ${instrument.Description} (UIC=${instrument.Identifier})`)
          }

          const placeOrderResponse = await app.trade.orders.post({
            RequestId: crypto.randomUUID(),

            AssetType: 'ContractFutures',
            Uic: instrument.Identifier,
            BuySell: 'Buy',
            Amount: calculateMinimumAmount(instrumentDetails),
            ManualOrder: false,
            ExternalReference: crypto.randomUUID(),
            OrderType: 'Market',
            OrderDuration: {
              DurationType: 'DayOrder',
            },
          })

          expect(placeOrderResponse).toBeDefined()
        })

        await resetAccount()
      }
    })

    test('CfdOnFutures', () => {
      // todo
    })

    test('Etc', () => {
      // todo
    })

    test('CfdOnEtc', () => {
      // todo
    })

    test('Etf', () => {
      // todo
    })

    test('CfdOnEtf', () => {
      // todo
    })

    test('Etn', () => {
      // todo
    })

    test('CfdOnEtn', () => {
      // todo
    })

    test('Fund', () => {
      // todo
    })

    test('CfdOnFund', () => {
      // todo
    })

    test('FuturesOption', () => {
      // todo
    })

    test('FxForwards', () => {
      // todo
    })

    test('FxNoTouchOption', () => {
      // todo
    })

    test('FxOneTouchOption', () => {
      // todo
    })

    test('FxSpot', () => {
      // todo
    })

    test('FxSwap', () => {
      // todo
    })

    test('FxVanillaOption', () => {
      // todo
    })

    test('Rights', () => {
      // todo
    })

    test('CfdOnRights', () => {
      // todo
    })
  })

  describe('cancelling orders', () => {
    test('Deleting order by order id', async () => {
      const [account] = await app.portfolio.accounts.me.get()
      if (account === undefined) {
        throw new Error(`Could not determine account for simulation user`)
      }

      const price = await findSuiteablePrice({
        app,
        assetType: 'FxSpot',
        uic: 21,
      })

      const placeOrderResponse = await app.trade.orders.post({
        ManualOrder: false,
        AssetType: 'FxSpot',
        Uic: 21,
        BuySell: 'Buy',
        Amount: 50_000,
        OrderType: 'Limit',
        OrderPrice: price.adjust('bid', -200),
        OrderDuration: {
          DurationType: 'DayOrder',
        },
        ExternalReference: crypto.randomUUID(),
      })

      expect(placeOrderResponse).toBeDefined()

      const deleteOrderResponse = await app.trade.orders.delete({
        AccountKey: account.AccountKey,
        OrderIds: [placeOrderResponse.OrderId],
      })

      expect(deleteOrderResponse).toBeDefined()

      expect(deleteOrderResponse.Orders).toHaveLength(1)
      expect(deleteOrderResponse.Orders[0]?.OrderId).toEqual(placeOrderResponse.OrderId)
    })

    test('Deleting orders by asset type', async () => {
      const [account] = await app.portfolio.accounts.me.get()
      if (account === undefined) {
        throw new Error(`Could not determine account for simulation user`)
      }

      const priceEURUSD = await findSuiteablePrice({
        app,
        assetType: 'FxSpot',
        uic: 21,
      })

      const priceEURDKK = await findSuiteablePrice({
        app,
        assetType: 'FxSpot',
        uic: 16,
      })

      const placeEURUSDOrderResponse = await app.trade.orders.post({
        ManualOrder: false,
        AssetType: 'FxSpot',
        Uic: 21,
        BuySell: 'Buy',
        Amount: 50_000,

        OrderType: 'Limit',
        OrderPrice: priceEURUSD.adjust('bid', -200),
        OrderDuration: {
          DurationType: 'GoodTillCancel',
        },

        ExternalReference: crypto.randomUUID(),
        IsForceOpen: undefined,
      })

      const placeEURDKKOrderResponse = await app.trade.orders.post({
        ManualOrder: false,
        AssetType: 'FxSpot',
        Uic: 16,
        BuySell: 'Buy',
        Amount: 50_000,

        OrderType: 'Limit',
        OrderPrice: priceEURDKK.adjust('bid', -200),
        OrderDuration: {
          DurationType: 'GoodTillCancel',
        },

        ExternalReference: crypto.randomUUID(),
        IsForceOpen: undefined,
      })

      expect(placeEURUSDOrderResponse.OrderId).not.toEqual(placeEURDKKOrderResponse.OrderId)

      const ordersBeforeDeletingOrder = await app.portfolio.orders.me.get()
      expect(ordersBeforeDeletingOrder).toHaveLength(2)

      const deleteOrderResponse = await app.trade.orders.delete({
        AccountKey: account.AccountKey,
        AssetType: 'FxSpot',
        Uic: 21,
      })

      expect(deleteOrderResponse).toBeUndefined()

      const ordersAfterDeletingOrder = await app.portfolio.orders.me.get()
      expect(ordersAfterDeletingOrder).toHaveLength(1)
    })
  })
})
