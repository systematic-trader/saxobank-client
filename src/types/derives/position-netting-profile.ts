import {
  enums,
  type GuardType,
} from 'https://raw.githubusercontent.com/systematic-trader/type-guard/main/mod.ts'

export type PositionNettingProfile = GuardType<typeof PositionNettingProfile>

export const PositionNettingProfile = enums([
  /**
   * FIFO - End-of-day:
   * - Position netting is done at End of Day using FIFO.
   * - Netting of positions in opposite directions can be prevented by placing related orders to positions. The position will appear as "squared" in the platform (e.g. SaxoTraderGo - if the opposing positions have the same size), but they won't be netted.
   * - It is possible to place related orders to positions
   */
  'FifoEndOfDay',
  /**
   * FIFO - Real-time:
   * - Position netting is done in real-time using FIFO.
   * - Netted positions are immediately moved from the "open positions" to the "closed positions" view within the trading platform.
   * - It is not possible to place related orders to positions.
   */
  'FifoRealTime',
  /**
   * Average - Real-time:
   * - Position netting is done in real-time using the Weighted Average Price method, hence only one open position per instrument will be maintained.
   * - Netted positions are immediately moved from the "open positions" to the "closed positions" view within the trading platform.
   * - It is not possible to place related orders to positions.
   */
  'AverageRealTime',
])
