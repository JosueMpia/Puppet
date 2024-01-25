import * as storeScope from 'ui-storage'
import * as GMX from 'gmx-middleware-const'
import { IUserType, ITradeFocusMode } from './type'
import { ISortBy } from 'ui-components'
import { IMarketCreatedEvent, TEMP_MARKET_LIST } from 'gmx-middleware-utils'
import * as viem from 'viem'
import { ISetRouteType } from 'puppet-middleware-utils'
import { IntervalTime } from 'common-utils'

export const store = storeScope.createStoreDefinition('root', 3, {
  global: {
    initialState: {
      activityTimeframe: IntervalTime.MONTH,
      marketList: [] as IMarketCreatedEvent[],
      selectedTradeRouteList: [] as ISetRouteType[],
    }
  },
  tradeBox: {
    initialState: {
      chartInterval: IntervalTime.MIN15,
      isTradingEnabled: false,
      isLong: true,
      focusMode: ITradeFocusMode.collateral,
      slippage: 30n,
      executionFeeBuffer: 3000n,
      primaryToken: GMX.ARBITRUM_ADDRESS.USDC,
      isUsdCollateralToken: true,
      feeRateIntervalDisplay: IntervalTime.MIN60,
      leverage: GMX.MAX_LEVERAGE_FACTOR / 4n,
      tradeRoute: null as viem.Address | null,
      marketToken: TEMP_MARKET_LIST[0].marketToken,
      traderRouteMap: {} as Record<string, viem.Address>
    },
  },
  leaderboard: {
    initialState: {
      sortBy: { direction: 'desc', selector: 'pnl' } as ISortBy,
      isLong: null as boolean | null,
    }
  },
  wallet: {
    initialState: {
      selectedTab: IUserType.PUPPET
    }
  }
})


