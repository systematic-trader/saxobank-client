import type { ServiceGroupClient } from '../../../service-group-client.ts'
import type { AssetType } from '../../../types/derives/asset-type.ts'
import {
  TradingSchedule as TradingScheduleGuard,
  type TradingSchedule as TradingScheduleType,
} from '../../../types/records/trading-schedule.ts'

export class TradingSchedule {
  readonly #client: ServiceGroupClient

  constructor({ client }: { readonly client: ServiceGroupClient }) {
    this.#client = client.appendPath('tradingschedule')
  }

  async get(
    { AssetType, Uic }: { readonly AssetType: AssetType; readonly Uic: number },
  ): Promise<TradingScheduleType> {
    return await this.#client.get({
      path: `${Uic}/${AssetType}`,
      guard: TradingScheduleGuard,
    })
  }
}
