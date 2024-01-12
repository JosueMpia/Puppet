import * as viem from 'viem'
import * as GMX from "gmx-middleware-const"
import { unixTimestampNow } from 'gmx-middleware-utils'

export default (puppet: viem.Address, activityTimeframe: GMX.IntervalTime) => {
  const blockTimestamp_gt = unixTimestampNow() - activityTimeframe

  return `{
  puppetTradeRoutes(
    first: 1000
    where: { puppet: "${puppet}" }
  ) {
    id
    routeTypeKey
    puppet
    trader
    tradeRoute
    settledList(where: { blockTimestamp_gte: ${blockTimestamp_gt} }) {
      id
      position {
        id
        link {
          id
          shareIncreaseList {
            id
            puppetsShares
            traderShares
            totalSupply
            tradeRoute
            requestKey
            blockTimestamp
            transactionHash
            __typename
          }
          __typename
        }
        position {
          id
          link {
            id
            key
            increaseList {
              id
              account
              market
              collateralToken
              sizeInTokens
              sizeInUsd
              collateralAmount
              borrowingFactor
              fundingFeeAmountPerSize
              longTokenClaimableFundingAmountPerSize
              shortTokenClaimableFundingAmountPerSize
              executionPrice
              indexTokenPriceMax
              indexTokenPriceMin
              collateralTokenPriceMax
              collateralTokenPriceMin
              sizeDeltaUsd
              sizeDeltaInTokens
              orderType
              collateralDeltaAmount
              priceImpactUsd
              priceImpactAmount
              isLong
              orderKey
              positionKey
              blockTimestamp
              transactionHash
              __typename
            }
            decreaseList {
              id
              account
              market
              collateralToken
              sizeInTokens
              sizeInUsd
              collateralAmount
              borrowingFactor
              fundingFeeAmountPerSize
              longTokenClaimableFundingAmountPerSize
              shortTokenClaimableFundingAmountPerSize
              executionPrice
              indexTokenPriceMax
              indexTokenPriceMin
              collateralTokenPriceMax
              collateralTokenPriceMin
              sizeDeltaUsd
              sizeDeltaInTokens
              collateralDeltaAmount
              valuesPriceImpactDiffUsd
              orderType
              priceImpactUsd
              basePnlUsd
              uncappedBasePnlUsd
              isLong
              orderKey
              positionKey
              blockTimestamp
              transactionHash
              __typename
            }
            feeUpdateList {
              id
              orderKey
              positionKey
              referralCode
              market
              collateralToken
              affiliate
              trader
              uiFeeReceiver
              collateralTokenPriceMin
              collateralTokenPriceMax
              tradeSizeUsd
              totalRebateFactor
              traderDiscountFactor
              totalRebateAmount
              traderDiscountAmount
              affiliateRewardAmount
              fundingFeeAmount
              claimableLongTokenAmount
              claimableShortTokenAmount
              latestFundingFeeAmountPerSize
              latestLongTokenClaimableFundingAmountPerSize
              latestShortTokenClaimableFundingAmountPerSize
              borrowingFeeUsd
              borrowingFeeAmount
              borrowingFeeReceiverFactor
              borrowingFeeAmountForFeeReceiver
              positionFeeFactor
              protocolFeeAmount
              positionFeeReceiverFactor
              feeReceiverAmount
              feeAmountForPool
              positionFeeAmountForPool
              positionFeeAmount
              totalCostAmount
              uiFeeReceiverFactor
              uiFeeAmount
              isIncrease
              blockTimestamp
              transactionHash
              __typename
            }
            __typename
          }
          key
          account
          market
          collateralToken
          indexToken
          sizeInUsd
          sizeInTokens
          collateralAmount
          realisedPnlUsd
          cumulativeSizeUsd
          cumulativeSizeToken
          cumulativeCollateralUsd
          cumulativeCollateralToken
          maxSizeUsd
          maxSizeToken
          maxCollateralToken
          maxCollateralUsd
          isLong
          blockTimestamp
          transactionHash
          __typename
        }
        trader
        tradeRoute
        puppets
        puppetsShares
        traderShares
        totalSupply
        routeTypeKey
        tradeRouteKey
        blockTimestamp
        transactionHash
        __typename
      }
      blockTimestamp
      transactionHash
      __typename
    }
    openList {
      id
      position {
        id
        link {
          id
          shareIncreaseList {
            id
            puppetsShares
            traderShares
            totalSupply
            tradeRoute
            requestKey
            blockTimestamp
            transactionHash
            __typename
          }
          __typename
        }
        position {
          id
          link {
            id
            key
            increaseList {
              id
              account
              market
              collateralToken
              sizeInTokens
              sizeInUsd
              collateralAmount
              borrowingFactor
              fundingFeeAmountPerSize
              longTokenClaimableFundingAmountPerSize
              shortTokenClaimableFundingAmountPerSize
              executionPrice
              indexTokenPriceMax
              indexTokenPriceMin
              collateralTokenPriceMax
              collateralTokenPriceMin
              sizeDeltaUsd
              sizeDeltaInTokens
              orderType
              collateralDeltaAmount
              priceImpactUsd
              priceImpactAmount
              isLong
              orderKey
              positionKey
              blockTimestamp
              transactionHash
              __typename
            }
            decreaseList {
              id
              account
              market
              collateralToken
              sizeInTokens
              sizeInUsd
              collateralAmount
              borrowingFactor
              fundingFeeAmountPerSize
              longTokenClaimableFundingAmountPerSize
              shortTokenClaimableFundingAmountPerSize
              executionPrice
              indexTokenPriceMax
              indexTokenPriceMin
              collateralTokenPriceMax
              collateralTokenPriceMin
              sizeDeltaUsd
              sizeDeltaInTokens
              collateralDeltaAmount
              valuesPriceImpactDiffUsd
              orderType
              priceImpactUsd
              basePnlUsd
              uncappedBasePnlUsd
              isLong
              orderKey
              positionKey
              blockTimestamp
              transactionHash
              __typename
            }
            feeUpdateList {
              id
              orderKey
              positionKey
              referralCode
              market
              collateralToken
              affiliate
              trader
              uiFeeReceiver
              collateralTokenPriceMin
              collateralTokenPriceMax
              tradeSizeUsd
              totalRebateFactor
              traderDiscountFactor
              totalRebateAmount
              traderDiscountAmount
              affiliateRewardAmount
              fundingFeeAmount
              claimableLongTokenAmount
              claimableShortTokenAmount
              latestFundingFeeAmountPerSize
              latestLongTokenClaimableFundingAmountPerSize
              latestShortTokenClaimableFundingAmountPerSize
              borrowingFeeUsd
              borrowingFeeAmount
              borrowingFeeReceiverFactor
              borrowingFeeAmountForFeeReceiver
              positionFeeFactor
              protocolFeeAmount
              positionFeeReceiverFactor
              feeReceiverAmount
              feeAmountForPool
              positionFeeAmountForPool
              positionFeeAmount
              totalCostAmount
              uiFeeReceiverFactor
              uiFeeAmount
              isIncrease
              blockTimestamp
              transactionHash
              __typename
            }
            __typename
          }
          key
          account
          market
          collateralToken
          indexToken
          sizeInUsd
          sizeInTokens
          collateralAmount
          realisedPnlUsd
          cumulativeSizeUsd
          cumulativeSizeToken
          cumulativeCollateralUsd
          cumulativeCollateralToken
          maxSizeUsd
          maxSizeToken
          maxCollateralToken
          maxCollateralUsd
          isLong
          blockTimestamp
          transactionHash
          __typename
        }
        trader
        tradeRoute
        puppets
        puppetsShares
        traderShares
        totalSupply
        routeTypeKey
        tradeRouteKey
        blockTimestamp
        transactionHash
        __typename
      }
      blockTimestamp
      transactionHash
      __typename
    }
    subscribeList {
      id
      allowance
      subscriptionExpiry
      trader
      puppet
      tradeRoute
      routeTypeKey
      subscribe
      blockTimestamp
      transactionHash
      __typename
    }
    __typename
  }
}`
}