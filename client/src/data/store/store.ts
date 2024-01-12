import * as storeScope from '../../utils/storage/storeScope.js'
import * as GMX from 'gmx-middleware-const'
import { IProfileMode, ITradeFocusMode } from '../type'
import { ISortBy } from 'gmx-middleware-ui-components'
import { IMarketCreatedEvent } from 'gmx-middleware-utils'
import * as viem from 'viem'
import { ISetRouteType } from 'puppet-middleware-utils'

export const store = storeScope.createStoreDefinition('root', 3, {
  global: {
    initialState: {
      activityTimeframe: GMX.IntervalTime.MONTH,
      marketList: [] as IMarketCreatedEvent[],
      selectedTradeRouteList: [] as ISetRouteType[],
    }
  },
  tradeBox: {
    initialState: {
      chartInterval: GMX.IntervalTime.MIN15,
      isTradingEnabled: false,
      isLong: true,
      focusMode: ITradeFocusMode.collateral,
      slippage: 30n,
      executionFeeBuffer: 3000n,
      primaryToken: GMX.ARBITRUM_ADDRESS.USDC,
      isUsdCollateralToken: true,
      borrowRateIntervalDisplay: GMX.IntervalTime.MIN60,
      fundingRateIntervalDisplay: GMX.IntervalTime.MIN60,
      leverage: GMX.MAX_LEVERAGE_FACTOR / 4n,
      tradeRoute: null as viem.Address | null,
      marketToken: null as viem.Address | null,
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
      selectedTab: IProfileMode.PUPPET
    }
  }
})


