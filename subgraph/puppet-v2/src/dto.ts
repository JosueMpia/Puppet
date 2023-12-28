import { Address, BigInt, Bytes } from "@graphprotocol/graph-ts"
import { EventLog } from "../generated/EventEmitter/EventEmitter"
import { MarketCreated, PositionDecrease, PositionFeeUpdate, PositionIncrease, PositionLink, PositionOpen, PositionSettled, PriceCandle } from "../generated/schema"
import { getAddressItem, getBoolItem, getBytes32Item, getIntItem, getUintItem } from "./utils/datastore"
import { getIdFromEvent } from "./utils/gmxHelpers"
import { IntervalUnixTime, MARKET_TOKEN_MAP, ZERO_BI } from "./utils/const"



export function createMarketCreated<T extends EventLog>(event: T): MarketCreated {
  const eventId = getIdFromEvent(event)
  const dto = new MarketCreated(eventId)

  dto.marketToken = getAddressItem(event.params.eventData, 0)
  dto.indexToken = getAddressItem(event.params.eventData, 1)
  dto.longToken = getAddressItem(event.params.eventData, 2)
  dto.shortToken = getAddressItem(event.params.eventData, 3)
  dto.salt = getBytes32Item(event.params.eventData, 0)

  return dto
}

export function createPositionIncrease<T extends EventLog>(event: T): PositionIncrease {
  const eventId = getIdFromEvent(event)
  const dto = new PositionIncrease(eventId)


  dto.account = getAddressItem(event.params.eventData, 0)
  dto.market = getAddressItem(event.params.eventData, 1)
  dto.collateralToken = getAddressItem(event.params.eventData, 2)

  dto.sizeInUsd = getUintItem(event.params.eventData, 0)
  dto.sizeInTokens = getUintItem(event.params.eventData, 1)
  dto.collateralAmount = getUintItem(event.params.eventData, 2)
  dto.borrowingFactor = getUintItem(event.params.eventData, 3)
  dto.fundingFeeAmountPerSize = getUintItem(event.params.eventData, 4)
  dto.longTokenClaimableFundingAmountPerSize = getUintItem(event.params.eventData, 5)
  dto.shortTokenClaimableFundingAmountPerSize = getUintItem(event.params.eventData, 6)
  dto.executionPrice = getUintItem(event.params.eventData, 7)
  dto.indexTokenPriceMax = getUintItem(event.params.eventData, 8)
  dto.indexTokenPriceMin = getUintItem(event.params.eventData, 9)
  dto.collateralTokenPriceMax = getUintItem(event.params.eventData, 10)
  dto.collateralTokenPriceMin = getUintItem(event.params.eventData, 11)
  dto.sizeDeltaUsd = getUintItem(event.params.eventData, 12)
  dto.sizeDeltaInTokens = getUintItem(event.params.eventData, 13)
  dto.orderType = getUintItem(event.params.eventData, 14)

  dto.collateralDeltaAmount = getIntItem(event.params.eventData, 0)
  dto.priceImpactUsd = getIntItem(event.params.eventData, 1)
  dto.priceImpactAmount = getIntItem(event.params.eventData, 2)

  dto.isLong = getBoolItem(event.params.eventData, 0)

  dto.orderKey = getBytes32Item(event.params.eventData, 0)
  dto.positionKey = getBytes32Item(event.params.eventData, 1)

  dto.blockNumber = event.block.number
  dto.blockTimestamp = event.block.timestamp
  dto.transactionHash = event.transaction.hash
  dto.transactionIndex = event.transaction.index
  dto.logIndex = event.logIndex

  return dto
}

export function createPositionFeeUpdate<T extends EventLog>(event: T): PositionFeeUpdate {
  const eventId = getIdFromEvent(event)
  const dto = new PositionFeeUpdate(eventId)

  dto.orderKey = getBytes32Item(event.params.eventData, 0)
  dto.positionKey = getBytes32Item(event.params.eventData, 1)
  dto.referralCode = getBytes32Item(event.params.eventData, 2)

  dto.market = getAddressItem(event.params.eventData, 0)
  dto.collateralToken = getAddressItem(event.params.eventData, 1)
  dto.affiliate = getAddressItem(event.params.eventData, 2)
  dto.trader = getAddressItem(event.params.eventData, 3)
  dto.uiFeeReceiver = getAddressItem(event.params.eventData, 4)

  dto.collateralTokenPriceMin = getUintItem(event.params.eventData, 0)
  dto.collateralTokenPriceMax = getUintItem(event.params.eventData, 1)
  dto.tradeSizeUsd = getUintItem(event.params.eventData, 2)
  dto.totalRebateFactor = getUintItem(event.params.eventData, 3)
  dto.traderDiscountFactor = getUintItem(event.params.eventData, 4)
  dto.totalRebateAmount = getUintItem(event.params.eventData, 5)
  dto.traderDiscountAmount = getUintItem(event.params.eventData, 6)
  dto.affiliateRewardAmount = getUintItem(event.params.eventData, 7)
  dto.fundingFeeAmount = getUintItem(event.params.eventData, 8)
  dto.claimableLongTokenAmount = getUintItem(event.params.eventData, 9)
  dto.claimableShortTokenAmount = getUintItem(event.params.eventData, 10)
  dto.latestFundingFeeAmountPerSize = getUintItem(event.params.eventData, 11)
  dto.latestLongTokenClaimableFundingAmountPerSize = getUintItem(event.params.eventData, 12)
  dto.latestShortTokenClaimableFundingAmountPerSize = getUintItem(event.params.eventData, 13)
  dto.borrowingFeeUsd = getUintItem(event.params.eventData, 14)
  dto.borrowingFeeAmount = getUintItem(event.params.eventData, 15)
  dto.borrowingFeeReceiverFactor = getUintItem(event.params.eventData, 16)
  dto.borrowingFeeAmountForFeeReceiver = getUintItem(event.params.eventData, 17)
  dto.positionFeeFactor = getUintItem(event.params.eventData, 18)
  dto.protocolFeeAmount = getUintItem(event.params.eventData, 19)
  dto.positionFeeReceiverFactor = getUintItem(event.params.eventData, 20)
  dto.feeReceiverAmount = getUintItem(event.params.eventData, 21)
  dto.feeAmountForPool = getUintItem(event.params.eventData, 22)
  dto.positionFeeAmountForPool = getUintItem(event.params.eventData, 23)
  dto.positionFeeAmount = getUintItem(event.params.eventData, 24)
  dto.totalCostAmount = getUintItem(event.params.eventData, 25)
  dto.uiFeeReceiverFactor = getUintItem(event.params.eventData, 26)
  dto.uiFeeAmount = getUintItem(event.params.eventData, 27)

  dto.isIncrease = getBoolItem(event.params.eventData, 0)

  dto.blockNumber = event.block.number
  dto.blockTimestamp = event.block.timestamp
  dto.transactionHash = event.transaction.hash
  dto.transactionIndex = event.transaction.index
  dto.logIndex = event.logIndex

  return dto
}

export function createPositionDecrease<T extends EventLog>(event: T): PositionDecrease {
  const eventId = getIdFromEvent(event)
  const dto = new PositionDecrease(eventId)

  dto.account = getAddressItem(event.params.eventData, 0)
  dto.market = getAddressItem(event.params.eventData, 1)
  dto.collateralToken = getAddressItem(event.params.eventData, 2)

  dto.sizeInUsd = getUintItem(event.params.eventData, 0)
  dto.sizeInTokens = getUintItem(event.params.eventData, 1)
  dto.collateralAmount = getUintItem(event.params.eventData, 2)
  dto.borrowingFactor = getUintItem(event.params.eventData, 3)
  dto.fundingFeeAmountPerSize = getUintItem(event.params.eventData, 4)
  dto.longTokenClaimableFundingAmountPerSize = getUintItem(event.params.eventData, 5)
  dto.shortTokenClaimableFundingAmountPerSize = getUintItem(event.params.eventData, 6)
  dto.executionPrice = getUintItem(event.params.eventData, 7)
  dto.indexTokenPriceMax = getUintItem(event.params.eventData, 8)
  dto.indexTokenPriceMin = getUintItem(event.params.eventData, 9)
  dto.collateralTokenPriceMax = getUintItem(event.params.eventData, 10)
  dto.collateralTokenPriceMin = getUintItem(event.params.eventData, 11)
  dto.sizeDeltaUsd = getUintItem(event.params.eventData, 12)
  dto.sizeDeltaInTokens = getUintItem(event.params.eventData, 13)
  dto.collateralDeltaAmount = getUintItem(event.params.eventData, 14)
  dto.valuesPriceImpactDiffUsd = getUintItem(event.params.eventData, 15)
  dto.orderType = getUintItem(event.params.eventData, 16)

  dto.priceImpactUsd = getIntItem(event.params.eventData, 0)
  dto.basePnlUsd = getIntItem(event.params.eventData, 1)
  dto.uncappedBasePnlUsd = getIntItem(event.params.eventData, 2)

  dto.isLong = getBoolItem(event.params.eventData, 0)

  dto.orderKey = getBytes32Item(event.params.eventData, 0)
  dto.positionKey = getBytes32Item(event.params.eventData, 1)

  dto.blockNumber = event.block.number
  dto.blockTimestamp = event.block.timestamp
  dto.transactionHash = event.transaction.hash
  dto.transactionIndex = event.transaction.index
  dto.logIndex = event.logIndex

  return dto
}

export function createPositionLink<T extends EventLog>(event: T, openSlot: PositionOpen): PositionLink {
  const dto = new PositionLink(openSlot.link)
  dto.key = openSlot.key

  dto.account = openSlot.account
  dto.market = openSlot.market
  dto.collateralToken = openSlot.collateralToken

  dto.isLong = openSlot.isLong

  dto.blockNumber = event.block.number
  dto.blockTimestamp = event.block.timestamp
  dto.transactionHash = event.transaction.hash
  dto.transactionIndex = event.transaction.index
  dto.logIndex = event.logIndex

  return dto
}

export function initPositionOpen(positionIncrease: PositionIncrease): PositionOpen {
  const dto = new PositionOpen(positionIncrease.positionKey.toHex())

  dto.key = positionIncrease.positionKey
  dto.link = positionIncrease.orderKey

  dto.account = positionIncrease.account
  dto.market = positionIncrease.market
  dto.collateralToken = positionIncrease.collateralToken
  dto.indexToken = MARKET_TOKEN_MAP.get(positionIncrease.market.toHex())

  dto.cumulativeSizeUsd = ZERO_BI
  dto.cumulativeSizeToken = ZERO_BI
  dto.cumulativeCollateralUsd = ZERO_BI
  dto.cumulativeCollateralToken = ZERO_BI

  dto.maxSizeUsd = ZERO_BI
  dto.maxSizeToken = ZERO_BI
  dto.maxCollateralToken = ZERO_BI
  dto.maxCollateralUsd = ZERO_BI

  dto.isLong = positionIncrease.isLong

  dto.realisedPnlUsd = ZERO_BI
  
  dto.blockNumber = positionIncrease.blockNumber
  dto.blockTimestamp = positionIncrease.blockTimestamp
  dto.transactionHash = positionIncrease.transactionHash
  dto.transactionIndex = positionIncrease.transactionIndex
  dto.logIndex = positionIncrease.logIndex

  return dto
}


export function createPositionSettled<T extends EventLog>(event: T, openPosition: PositionOpen): PositionSettled {
  const dto = new PositionSettled(getIdFromEvent(event))

  dto.link = openPosition.link
  dto.key = openPosition.key

  dto.account = openPosition.account
  dto.market = openPosition.market
  dto.collateralToken = openPosition.collateralToken
  dto.indexToken = openPosition.indexToken

  dto.sizeInUsd = openPosition.sizeInUsd
  dto.sizeInTokens = openPosition.sizeInTokens
  dto.collateralAmount = openPosition.collateralAmount
  dto.realisedPnlUsd = openPosition.realisedPnlUsd

  dto.cumulativeSizeUsd = openPosition.cumulativeSizeUsd
  dto.cumulativeSizeToken = openPosition.cumulativeSizeToken
  dto.cumulativeCollateralUsd = openPosition.cumulativeCollateralUsd
  dto.cumulativeCollateralToken = openPosition.cumulativeCollateralToken

  dto.maxSizeUsd = openPosition.maxSizeUsd
  dto.maxSizeToken = openPosition.maxSizeToken
  dto.maxCollateralToken = openPosition.maxCollateralToken
  dto.maxCollateralUsd = openPosition.maxCollateralUsd

  dto.isLong = openPosition.isLong

  dto.realisedPnlUsd = openPosition.realisedPnlUsd

  dto.blockNumber = event.block.number
  dto.blockTimestamp = event.block.timestamp
  dto.transactionHash = event.transaction.hash
  dto.transactionIndex = event.transaction.index
  dto.logIndex = event.logIndex

  return dto
}

