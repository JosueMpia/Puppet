import * as viem from "viem"
import { IMirrorPositionListSummary, IPositionMirrorSettled, IPositionMirrorSlot } from "./types.js"
import { IOraclePrice, factor, getPositionPnlUsd, hashData, lst } from "gmx-middleware-utils"
import { toBytes } from "viem"


export function summariesMirrorTrader(settledTradeList: IPositionMirrorSettled[], shareTarget?: viem.Address): IMirrorPositionListSummary {

  const seedAccountSummary: IMirrorPositionListSummary = {
    settledTradeList,
    trader: settledTradeList[0].trader,
    routeTypeKey: settledTradeList[0].routeTypeKey,
    size: 0n,
    collateral: 0n,
    cumulativeLeverage: 0n,
    puppets: [],

    avgCollateral: 0n,
    avgSize: 0n,

    fee: 0n,
    lossCount: 0,
    pnl: 0n,
    winCount: 0,
  }

  const summary = settledTradeList.reduce((seed, next, idx): IMirrorPositionListSummary => {
    const idxBn = BigInt(idx) + 1n


    const size = seed.size + getParticiapntMpPortion(next, next.maxSizeUsd, shareTarget)
    const collateral = seed.collateral + getParticiapntMpPortion(next, next.maxCollateralUsd, shareTarget)
    const cumulativeLeverage = seed.cumulativeLeverage + getParticiapntMpPortion(next, factor(next.maxSizeUsd, next.maxCollateralUsd), shareTarget)

    const avgSize = size / idxBn
    const avgCollateral = collateral / idxBn

    const fee = seed.fee + getParticiapntMpPortion(next, next.cumulativeFee, shareTarget)
    const pnl = seed.pnl + getParticiapntMpPortion(next, next.realisedPnl, shareTarget)


    const winCount = seed.winCount + (next.realisedPnl > 0n ? 1 : 0)
    const lossCount = seed.lossCount + (next.realisedPnl <= 0n ? 1 : 0)

    const puppets = [...seed.puppets, ...next.puppets.filter(x => !seed.puppets.includes(x))]

    return {
      settledTradeList: seed.settledTradeList,
      trader: seed.trader,
      routeTypeKey: seed.routeTypeKey,
      size,
      collateral,
      cumulativeLeverage,
      avgCollateral,
      avgSize,
      fee,
      lossCount,
      pnl,
      winCount,
      puppets,
    }
  }, seedAccountSummary)


  return summary
}


export function getPuppetShare(shares: readonly bigint[], puppets: readonly viem.Address[], puppet: viem.Address): bigint {
  const idx = puppets.indexOf(puppet)

  if (idx == -1) throw new Error("Puppet not found")

  return shares[idx]
}

export function getParticiapntMpShare(mp: IPositionMirrorSettled | IPositionMirrorSlot, shareTarget?: viem.Address): bigint {
  if (!shareTarget || mp.puppets.indexOf(shareTarget) === -1) return mp.traderShare

  return getPuppetShare(mp.shares, mp.puppets, shareTarget)
}

export function getParticiapntMpPortion(mp: IPositionMirrorSettled | IPositionMirrorSlot, amount: bigint, shareTarget?: viem.Address): bigint {
  const share = getParticiapntMpShare(mp, shareTarget)

  return getPortion(mp.shareSupply, share, amount)
}


export function getMpSlotPnL(mp: IPositionMirrorSlot, markPrice: IOraclePrice, shareTarget?: viem.Address): bigint {
  const update = lst(mp.updates)
  const delta = getPositionPnlUsd(mp.isLong,  update.sizeInUsd, update.sizeInTokens, markPrice.min)
  const openPnl = getParticiapntMpPortion(mp, delta, shareTarget)

  return openPnl
}


export function getPortion(supply: bigint, share: bigint, amount: bigint): bigint {
  if (supply === 0n) return amount
  if (amount == 0n) throw new Error("amount cannot be 0")

  if (share == 0n) {
    return amount
  } else {
    return amount * share / supply
  }
}

export function hashNamedValue(name: string, value: viem.Hex): viem.Hex {
  return hashData(
    ["string", "bytes"],
    [name, value]
  )
}



export function getRouteTypeKey(collateralToken: viem.Address, indexToken: viem.Address, isLong: boolean, data: viem.Hex): viem.Hex {
  return hashData(
    ["address", "address", "bool", "bytes"],
    [collateralToken, indexToken, isLong, data ]
  )
}


export function getRouteKey(trader: viem.Address, routeTypeKey: viem.Hex): viem.Hex {
  return hashData(
    ["address", "bytes"],
    [trader, routeTypeKey]
  )
}

export function getPuppetSubscriptionKey(puppet: viem.Address, trader: viem.Address, routeTypeKey: viem.Hex): viem.Hex {
  return hashData(
    ["address", "address", "bytes32"],
    [puppet, trader, routeTypeKey]
  )
}




