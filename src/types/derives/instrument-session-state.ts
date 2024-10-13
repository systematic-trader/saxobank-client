import { enums } from 'https://raw.githubusercontent.com/systematic-trader/type-guard/main/mod.ts'

export const InstrumentSessionState = enums([
  /** Participants place orders to buy or sell units at certain buying or selling prices. Orders collected during an auction are matched to form a contract */
  'Auction',
  /** Normal trading */
  'AutomatedTrading',
  /** Break in instrument opening hours */
  'Break',
  /** Participants place orders to buy or sell units at certain buying or selling prices. Orders collected during an auction are matched to form a contract */
  'CallAuctionTrading',
  /** Closed for trading */
  'Closed',
  /** Trading is halted for an instrument */
  'Halt',
  /** Opening auction exchange state */
  'OpeningAuction',
  /** Transactions are conducted in trading pits on the floor of the Exchange */
  'PitTrading',
  /** Legacy trade state. It will be decommissioned and should not be used */
  'PostAutomatedTrading',
  /** Extended trading session after the regular trading session. Specify the orders ExecuteAtTradingSession field to trade in this session */
  'PostMarket',
  /** The exchange is accepting orders which will be traded in the OpeningAuction or AutomatedTrading session of the following day */
  'PostTrading',
  /** Legacy trade state. It will be decommissioned and should not be used */
  'PreAutomatedTrading',
  /** Extended trading session before the regular trading session. Specify the orders ExecuteAtTradingSession field to trade in this session */
  'PreMarket',
  /** */
  'PreTrading',
  /** Trading is suspended for an instrument */
  'Suspended',
  /** Orders collected at last price in absence of closing auction price */
  'TradingAtLast',
])
