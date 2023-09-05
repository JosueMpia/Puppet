import { Behavior, combineArray, combineObject, replayLatest } from "@aelea/core"
import { $Node, $node, $text, MOTION_NO_WOBBLE, NodeComposeFn, attr, component, motion, style, styleInline } from "@aelea/dom"
import { $NumberTicker, $column, $row, layoutSheet, screenUtils } from "@aelea/ui-components"
import { colorAlpha, pallete } from "@aelea/ui-components-theme"
import {
  awaitPromises, constant, delay, empty, map,
  mergeArray,
  multicast, now,
  skipRepeats,
  skipRepeatsWith,
  snapshot,
  startWith,
  switchLatest
} from "@most/core"
import { Stream } from "@most/types"
import { erc20Abi } from "abitype/test"
import * as GMX from "gmx-middleware-const"
import {
  $alert,
  $alertTooltip,
  $anchor,
  $infoLabeledValue,
  $infoTooltipLabel
} from "gmx-middleware-ui-components"
import {
  DecreasePositionSwapType,
  IPositionSlot, IPriceInterval,
  OrderType,
  StateStream,
  abs,
  div,
  filterNull,
  getBasisPoints,
  getDenominator,
  getPnL, getTokenDescription,
  parseReadableNumber,
  readableFixedUSD30,
  readablePercentage,
  readableUnitAmount,
  resolveAddress,
  safeDiv,
  switchMap
} from "gmx-middleware-utils"
import { MouseEventParams } from "lightweight-charts"
import * as PUPPET from "puppet-middleware-const"
import { getRouteTypeKey } from "puppet-middleware-utils"
import * as viem from "viem"
import { $Popover } from "../$Popover"
import { $entry, $openPositionPnlBreakdown, $pnlValue, $sizeAndLiquidation } from "../../common/$common"
import { $heading2 } from "../../common/$text"
import { latestTokenPrice } from "../../data/process/process.js"
import { connectContract, wagmiWriteContract } from "../../logic/common.js"
import { IWalletClient } from "../../wallet/walletLink.js"
import { $ButtonPrimary, $ButtonPrimaryCtx, $ButtonSecondary, $defaultMiniButtonSecondary } from "../form/$Button.js"
import { IPositionEditorAbstractParams, ITradeConfig, ITradeParams } from "./$PositionEditor"
import { BLUEBERRY_REFFERAL_CODE } from "@gambitdao/gbc-middleware"


export enum ITradeFocusMode {
  collateral,
  size,
}




interface IPositionDetailsPanel extends IPositionEditorAbstractParams {
  wallet: IWalletClient
  openPositionList: Stream<IPositionSlot[]>

  pricefeed: Stream<IPriceInterval[]>
  tradeConfig: StateStream<ITradeConfig> // ITradeParams
  tradeState: StateStream<ITradeParams>

  $container: NodeComposeFn<$Node>
}

export type IRequestTradeParams = ITradeConfig & { wallet: IWalletClient }
export type IRequestTrade = IRequestTradeParams & {
  // key: viem.Hex
  executionFee: bigint
  indexPrice: bigint
  acceptablePrice: bigint
  swapRoute: string[]
  request: Promise<viem.TransactionReceipt>
}




export const $PositionDetailsPanel = (config: IPositionDetailsPanel) => component((

  [openEnableTradingPopover, openEnableTradingPopoverTether]: Behavior<any, any>,
  [dismissEnableTradingOverlay, dismissEnableTradingOverlayTether]: Behavior<false, false>,
  [crosshairMove, crosshairMoveTether]: Behavior<MouseEventParams, MouseEventParams>,

  [enableTradingPlugin, enableTradingPluginTether]: Behavior<PointerEvent, PointerEvent>,
  [approveTrading, approveTradingTether]: Behavior<PointerEvent, true>,

  [clickApproveprimaryToken, clickApproveprimaryTokenTether]: Behavior<PointerEvent, { route: viem.Address, primaryToken: viem.Address }>,

  [clickResetPosition, clickResetPositionTether]: Behavior<any, null>,

  [clickProposeTrade, clickProposeTradeTether]: Behavior<PointerEvent, IWalletClient>,
  [switchTrade, switchTradeTether]: Behavior<any, IPositionSlot>,

) => {

  const gmxContractMap = GMX.CONTRACT[config.chain.id]

  const vault = connectContract(gmxContractMap.Vault)
  const router = connectContract(gmxContractMap.Router)
  const positionRouterAddress = GMX.CONTRACT[config.chain.id].PositionRouter.address


  const { 
    collateralDeltaUsd, collateralToken, collateralDelta, marketInfo, market, isUsdCollateralToken, sizeDelta, focusMode,
    primaryToken, isIncrease, isLong, leverage, sizeDeltaUsd, slippage 
  } = config.tradeConfig
  const {
    availableIndexLiquidityUsd, averagePrice, collateralDescription,
    collateralTokenPoolInfo, collateralPrice, stableFundingRateFactor, fundingRateFactor, executionFee, executionFeeUsd, fundingFee,
    indexDescription, indexPrice, primaryPrice, primaryDescription, isPrimaryApproved, marketPrice,
    isTradingEnabled, liquidationPrice, marginFee, route,
    position, swapFee, walletBalance, markets, priceImpactUsd, totalNextFeesUsd
  } = config.tradeState


  const walletBalanceUsd = skipRepeats(combineArray(params => {
    const amountUsd = params.walletBalance * params.primaryPrice

    return params.primaryToken === GMX.ADDRESS_ZERO ? amountUsd - GMX.DEDUCT_USD_FOR_GAS : amountUsd
  }, combineObject({ walletBalance, primaryPrice, primaryToken })))




  const inTradeMode = replayLatest(multicast(skipRepeats(combineArray((sizeDeltaUsd, collateralDeltaUsd) => {
    if (sizeDeltaUsd === 0n && collateralDeltaUsd === 0n) {
      return false
    }

    return true
  }, sizeDeltaUsd, collateralDeltaUsd))))


  const pnlCrossHairTimeChange = replayLatest(multicast(startWith(null, skipRepeatsWith(((xsx, xsy) => xsx.time === xsy.time), crosshairMove))))

  const pnlCrossHairTime = map((cross: MouseEventParams) => {
    if (cross) {
      return cross.seriesData.values().next().value
    }

    return null
  }, pnlCrossHairTimeChange)

  const validationError = skipRepeats(map((state) => {

    if (state.leverage > GMX.MAX_LEVERAGE_FACTOR) {
      return `Leverage exceeds ${readablePercentage(GMX.MAX_LEVERAGE_FACTOR)}x`
    }

    if (state.isIncrease) {
      if (state.sizeDeltaUsd > state.availableIndexLiquidityUsd) {
        return `Not enough liquidity. current capcity ${readableFixedUSD30(state.availableIndexLiquidityUsd)}`
      }

      if (state.isIncrease ? state.collateralDelta > state.walletBalance : state.collateralDeltaUsd > state.walletBalanceUsd) {
        return `Not enough ${state.primaryDescription.symbol} in connected account`
      }

      if (state.leverage < GMX.MIN_LEVERAGE_FACTOR) {
        return `Leverage below 1.1x`
      }

      // if (state.position === null && state.collateralDeltaUsd < 10n ** 30n * 10n) {
      //   return `Min 10 Collateral required`
      // }
    } else {

      if (state.position && state.primaryToken !== state.collateralToken) {
        const delta = getPnL(state.isLong, state.position.averagePrice, state.indexPrice, -state.sizeDeltaUsd)
        const adjustedSizeDelta = safeDiv(abs(state.sizeDeltaUsd) * delta, state.position.latestUpdate.sizeInUsd)
        const fees = state.swapFee + state.marginFee
        const collateralDelta = -state.sizeDeltaUsd === state.position.latestUpdate.sizeInUsd
          ? state.position.collateral - state.fundingFee
          : -state.collateralDeltaUsd

        const totalOut = collateralDelta + adjustedSizeDelta - fees

        const nextUsdgAmount = totalOut * getDenominator(GMX.USDG_DECIMALS) / GMX.PERCISION
        if (state.collateralTokenPoolInfo.usdgAmounts + nextUsdgAmount > state.collateralTokenPoolInfo.maxUsdgAmounts) {
          return `${state.collateralDescription.symbol} pool exceeded, you cannot receive ${state.primaryDescription.symbol}, switch to ${state.collateralDescription.symbol} in the first input token switcher`
        }
      }

    }

    if (!state.isIncrease && state.position === null) {
      return `No ${state.indexDescription.symbol} position to reduce`
    }

    if (state.position && state.liquidationPrice && (state.isLong ? state.liquidationPrice > state.indexPrice : state.liquidationPrice < state.indexPrice)) {
      return `Exceeding liquidation price`
    }

    return null
  }, combineObject({
    leverage, position, swapFee, marginFee, fundingFee, liquidationPrice, walletBalance,
    walletBalanceUsd, isIncrease, indexPrice, collateralDelta, collateralDeltaUsd, primaryDescription,
    collateralToken, sizeDeltaUsd, availableIndexLiquidityUsd, primaryToken, collateralTokenPoolInfo,
    collateralDescription, indexDescription, isLong,
  })))








  const requestTradeParams = snapshot((config, wallet): IRequestTradeParams => {
    return { ...config, wallet }
  }, combineObject(config.tradeConfig), clickProposeTrade)


  const requestTrade: Stream<IRequestTrade> = multicast(snapshot((params, req) => {
    const resolvedPrimaryAddress = resolveAddress(config.chain, req.primaryToken)
    const from = req.isIncrease ? resolvedPrimaryAddress : req.isLong ? req.market.indexToken : req.collateralToken
    const to = req.isIncrease ? req.isLong ? req.market.indexToken : req.collateralToken : resolvedPrimaryAddress

    const swapRoute = from === to ? [to] : [from, to]

    const slippageN = BigInt(Number(req.slippage) * 100)
    const allowedSlippage = req.isLong
      ? req.isIncrease
        ? slippageN : -slippageN
      : req.isIncrease
        ? -slippageN : slippageN

    const priceBasisPoints = GMX.PERCISION + allowedSlippage
    const acceptablePrice = params.indexPrice * priceBasisPoints / GMX.PERCISION
    const isNative = req.primaryToken === GMX.ADDRESS_ZERO


    // const swapParams = {
    //   amount: req.collateralDelta,
    //   minOut: 0n,
    //   path: swapRoute
    // }
    // const tradeParams = {
    //   acceptablePrice,
    //   amountIn: 0n,
    //   collateralDelta: req.collateralDelta,
    //   minOut: 0n,
    //   sizeDelta: abs(req.sizeDeltaUsd)
    // }

    const value = isNative ? params.executionFee + req.collateralDelta : params.executionFee



    const orderVaultAddress = GMX.CONTRACT[config.chain.id].OrderVault.address

    const wntCollateralAmount = isNative ? req.collateralDelta : 0n
    const totalWntAmount = wntCollateralAmount + params.executionFee

    const sendWnt = viem.encodeFunctionData({
      abi: GMX.CONTRACT[config.chain.id].ExchangeRouter.abi,
      functionName: 'sendWnt',
      args: [orderVaultAddress, totalWntAmount]
    })

    
    const sendTokensCalldata = viem.encodeFunctionData({
      abi: GMX.CONTRACT[config.chain.id].ExchangeRouter.abi,
      functionName: 'sendTokens',
      args: [resolvedPrimaryAddress, orderVaultAddress, req.collateralDelta]
    })


    const createOrderCalldata = viem.encodeFunctionData({
      abi: GMX.CONTRACT[config.chain.id].ExchangeRouter.abi,
      functionName: 'createOrder',
      args: [
        {
          addresses: {
            receiver: config.wallet.account.address,
            callbackContract: GMX.ADDRESS_ZERO,
            uiFeeReceiver: GMX.ADDRESS_ZERO,
            market: req.market.marketToken,
            initialCollateralToken: req.collateralToken,
            swapPath: [req.market.marketToken]
          },
          numbers: {
            sizeDeltaUsd: req.sizeDeltaUsd,
            initialCollateralDeltaAmount: req.collateralDelta,
            acceptablePrice: acceptablePrice,
            triggerPrice: acceptablePrice,
            executionFee: params.executionFee,
            callbackGasLimit: 0n,
            minOutputAmount: 0n,
          },
          orderType: OrderType.MarketIncrease,
          decreasePositionSwapType: DecreasePositionSwapType.NoSwap,
          isLong: req.isLong,
          shouldUnwrapNativeToken: isNative,
          referralCode: BLUEBERRY_REFFERAL_CODE,
        }
      ]
    })
    
    const request = wagmiWriteContract({
      ...GMX.CONTRACT[config.chain.id].ExchangeRouter,
      value,
      functionName: 'multicall',
      args: [[
        sendWnt,
        ...isNative ? [] : [sendTokensCalldata],
        createOrderCalldata,
      ]]
    })

    // const request = wagmiWriteContract({
    //   ...GMX.CONTRACT[config.chain.id].ExchangeRouter,
    //   value,
    //   functionName: 'createOrder',
    //   args: 
    // })

    // const request = params.route === GMX.ADDRESS_ZERO
    //   ? wagmiWriteContract({
    //     ...PUPPET.CONTRACT[config.chain.id].Orchestrator,
    //     value,
    //     functionName: 'registerRouteAccountAndRequestPosition',
    //     args: [
    //       tradeParams,
    //       swapParams,
    //       params.executionFee,
    //       req.collateralToken,
    //       req.market.indexToken,
    //       req.isLong
    //     ]
    //   })
    //   : wagmiWriteContract({
    //     ...PUPPET.CONTRACT[config.chain.id].Orchestrator,
    //     functionName: 'requestPosition',
    //     value,
    //     args: [
    //       tradeParams,
    //       swapParams,
    //       getRouteTypeKey(req.collateralToken, req.market.indexToken, req.isLong),
    //       params.executionFee,
    //       req.isIncrease
    //     ]
    //   })


    return { ...params, ...req, acceptablePrice, request, swapRoute }
  }, combineObject({ executionFee, indexPrice, route }), requestTradeParams))

  const requestTradeError = filterNull(awaitPromises(map(async req => {
    try {
      await req.request
      return null
    } catch (err) {

      if (err instanceof viem.ContractFunctionExecutionError && err.cause instanceof viem.ContractFunctionRevertedError) {
        return String(err.cause.reason)
      }

      return null
    }
  }, requestTrade)))


  const requestEnablePlugin = multicast(map(async () => {
    const recpt = wagmiWriteContract({
      ...GMX.CONTRACT[config.chain.id].Router,
      functionName: 'approvePlugin',
      args: [positionRouterAddress],
      value: undefined
    })
    return recpt
  }, enableTradingPlugin))

  const requestApproveSpend = multicast(map(params => {
    const recpt = wagmiWriteContract({
      address: params.primaryToken,
      abi: erc20Abi,
      functionName: 'approve',
      args: [params.route, 2n ** 256n - 1n]
    })
    return recpt
  }, clickApproveprimaryToken))


  return [
    config.$container(
      $column(layoutSheet.spacing, style({ padding: '16px 0', placeContent: 'space-between' }), styleInline(map(mode => ({ display: mode ? 'flex' : 'none' }), inTradeMode)))(
        $column(layoutSheet.spacingSmall)(
          // $TextField({
          //   label: 'Slippage %',
          //   labelStyle: { flex: 1 },
          //   value: config.tradeConfig.slippage,
          //   inputOp: style({ width: '60px', maxWidth: '60px', textAlign: 'right', fontWeight: 'normal' }),
          //   validation: map(n => {
          //     const val = Number(n)
          //     const valid = val >= 0
          //     if (!valid) {
          //       return 'Invalid Basis point'
          //     }

          //     if (val > 5) {
          //       return 'Slippage should be less than 5%'
          //     }

          //     return null
          //   }),
          // })({
          //   change: changeSlippageTether()
          // }),

          $column(
            // switchLatest(map(params => {
            //   const totalSizeUsd = params.position ? params.position.latestUpdate.sizeInUsd + params.sizeDeltaUsd : params.sizeDeltaUsd

            //   const rateFactor = params.fundingRateFactor
            //   const rate = safeDiv(rateFactor * params.collateralTokenPoolInfo.reservedAmount, params.collateralTokenPoolInfo.poolAmounts)
            //   const nextSize = totalSizeUsd * rate / GMX.BASIS_POINTS_DIVISOR / 100n

            //   return $column(
            //     $infoLabeledValue(
            //       'Borrow Fee',
            //       $row(layoutSheet.spacingTiny)(
            //         $text(style({ color: pallete.indeterminate }))(readableFixedUSD30(nextSize) + ' '),
            //         $text(` / 1hr`)
            //       )
            //     )
            //   )
            // }, combineObject({ ...config.tradeState, sizeDeltaUsd }))),
            $infoLabeledValue('Swap', $text(style({ color: pallete.indeterminate, placeContent: 'space-between' }))(map(readableFixedUSD30, swapFee))),
            $infoLabeledValue('Execution Fee', $text(style({ color: pallete.indeterminate, placeContent: 'space-between' }))(map(fee => `${readableFixedUSD30(fee)}`, executionFeeUsd))),
            $infoLabeledValue('Price Impact', $text(style({ color: pallete.indeterminate, placeContent: 'space-between' }))(map(params => `${readablePercentage(getBasisPoints(params.priceImpactUsd, params.sizeDeltaUsd))} ${readableFixedUSD30(params.priceImpactUsd)}`, combineObject({ priceImpactUsd, sizeDeltaUsd })))),
            $infoLabeledValue('Margin', $text(style({ color: pallete.indeterminate, placeContent: 'space-between' }))(map(readableFixedUSD30, marginFee))),
          ),
          $row(style({ placeContent: 'space-between' }))(

            $infoTooltipLabel(
              $column(layoutSheet.spacingSmall)(
                $text('Collateral deducted upon your deposit including Borrow fee at the start of every hour. the rate changes based on utilization, it is calculated as (assets borrowed) / (total assets in pool) * 0.01%'),
              ),
              'Total Fees'
            ),
            $text(style({ color: pallete.indeterminate }))(
              map(total => readableFixedUSD30(total), totalNextFeesUsd)
            ),
          ),

        ),

        $column(layoutSheet.spacingSmall)(
          switchLatest(map(params => {
            if (!params.isTradingEnabled) {
              return $Popover({
                $target: $row(style({ placeContent: 'flex-end' }))(
                  $ButtonSecondary({
                    $content: $text('Enable Trading'),
                    disabled: mergeArray([
                      dismissEnableTradingOverlay,
                      openEnableTradingPopover
                    ])
                  })({
                    click: openEnableTradingPopoverTether()
                  })
                ),
                $popContent: map(() => {

                  return $column(layoutSheet.spacing, style({ maxWidth: '400px' }))(
                    $heading2(`By using Puppet, I agree to the following Disclaimer`),
                    $text(style({}))(`By accessing, I agree that ${document.location.href} is an interface that interacts with external GMX smart contracts, and does not have access to my funds.`),

                    $alert(
                      $node(
                        $text('This beta version may contain bugs. Feedback and issue reports are greatly appreciated.'),
                        $anchor(attr({ href: 'https://discord.com/channels/941356283234250772/1068946527021695168' }))($text('discord'))
                      )
                    ),

                    $node(
                      $text(style({ whiteSpace: 'pre-wrap' }))(`By clicking Agree you accept the `),
                      $anchor(attr({ href: '/app/trading-terms-and-conditions' }))($text('Terms & Conditions'))
                    ),

                    $ButtonPrimary({
                      $content: $text('Approve T&C'),
                    })({
                      click: approveTradingTether(constant(true))
                    })
                  )
                }, openEnableTradingPopover),
              })({
                overlayClick: dismissEnableTradingOverlayTether(constant(false))
              })
            }

            if (params.route && !params.isPrimaryApproved) {

              return $ButtonPrimaryCtx({
                request: requestApproveSpend,
                $content: $text(`Approve ${params.primaryDescription.symbol}`)
              })({
                click: clickApproveprimaryTokenTether(
                  constant({ route: params.route, primaryToken: params.primaryToken })
                )
              })
            }

            const disableButtonVlidation = map((error) => {
              if (error) {
                return true
              }

              return false
            }, validationError)
            return $row(layoutSheet.spacingSmall, style({ alignItems: 'center', flex: 1 }))(
              $row(style({ flex: 1, minWidth: 0 }))(
                switchLatest(map(error => {
                  if (error === null) {
                    return empty()
                  }

                  return $alertTooltip(
                    $text(error)
                  )
                }, mergeArray([requestTradeError, validationError])))
              ),
              style({ padding: '8px', alignSelf: 'center' })(
                $ButtonSecondary({ $content: $text('Reset') })({
                  click: clickResetPositionTether(constant(null))
                })
              ),
              $ButtonPrimaryCtx({
                request: map(req => req.request, requestTrade),
                // disabled: combineArray((isDisabled) => isDisabled, disableButtonVlidation),
                $content: $text(map(params => {
                  let modLabel: string

                  if (params.position) {
                    if (params.isIncrease) {
                      modLabel = 'Increase'
                    } else {
                      modLabel = (params.sizeDeltaUsd + params.position.latestUpdate.sizeInUsd === 0n) ? 'Close' : 'Reduce'
                    }
                  } else {
                    modLabel = 'Open'
                  }

                  return modLabel
                }, combineObject({ position, sizeDeltaUsd, isIncrease })))
              })({
                click: clickProposeTradeTether(
                  constant(config.wallet)
                )
              })
            )
          }, combineObject({ isPrimaryApproved, route, isTradingEnabled, primaryToken, primaryDescription })))
        ),
      ),

      styleInline(map(mode => ({ display: mode ? 'none' : 'flex' }), inTradeMode))(
        switchMap(params => {
          const pos = params.position
          if (pos === null) {
            const tokenDesc = getTokenDescription(params.market.indexToken)
            const route = params.isLong ? `Long-${tokenDesc.symbol}` : `Short-${tokenDesc.symbol}/${getTokenDescription(params.collateralToken).symbol}`

            return $row(style({ placeContent: 'center', alignItems: 'center' }))(
              $text(style({ color: pallete.foreground }))(`No active ${route} position`)
            )
          }

          const hoverChartPnl = switchLatest(map((chartCxChange) => {
            if (Number.isFinite(chartCxChange)) {
              return now(chartCxChange)
            }


            return map(price => {
              const delta = getPnL(pos.isLong, pos.averagePrice, price, pos.size)
              // const val = formatFixed(delta + pos.realisedPnl - pos.cumulativeFee, 30)
              const val = 0

              return val
            }, indexPrice)

          }, pnlCrossHairTime))

          const rateFactor = params.isLong ? params.fundingRateFactor : params.stableFundingRateFactor
          const rate = safeDiv(rateFactor * params.collateralTokenPoolInfo.reservedAmount, params.collateralTokenPoolInfo.poolAmounts)
          const nextSize = pos.size * rate / GMX.PERCISION / 100n


          return $column(style({ position: 'relative' }))(
            $row(
              style({
                display: 'flex',
                alignItems: 'center',
                lineHeight: 1,
                height: '1px',
                zIndex: 10,
                position: 'absolute',
                placeContent: 'space-between',
                inset: '18px 16px',
              })
            )(
              $infoLabeledValue(
                'Borrow Fee',
                $row(layoutSheet.spacingTiny)(
                  $text(style({ color: pallete.indeterminate }))(readableFixedUSD30(nextSize) + ' '),
                  $text(` / 1hr`)
                )
              ),
              $infoTooltipLabel(
                // $openPositionPnlBreakdown(pos, now(params.collateralTokenPoolInfo.cumulativeRate)),
                $NumberTicker({
                  textStyle: {
                    fontSize: '1.25em',
                    fontWeight: 'bold',
                  },
                  value$: map(hoverValue => {
                    const newLocal2 = readableUnitAmount(hoverValue)
                    const newLocal = parseReadableNumber(newLocal2)
                    return newLocal
                  }, motion({ ...MOTION_NO_WOBBLE, precision: 15, stiffness: 210 }, 0, hoverChartPnl)),
                  incrementColor: pallete.positive,
                  decrementColor: pallete.negative
                }),
              ),
            ),
            // $TradePnlHistory({
            //   $container: $column(style({ flex: 1, overflow: 'hidden', borderRadius: '20px' })),
            //   position: pos,
            //   chain: config.chain.id,
            //   pricefeed,
            //   chartConfig: {
            //     leftPriceScale: {
            //       scaleMargins: {
            //         top: 0.38,
            //         bottom: 0,
            //       }
            //     },
            //     // timeScale: {
            //     //   visible: false
            //     // }
            //   },
            //   latestPrice: indexTokenPrice
            // })({
            //   crosshairMove: crosshairMoveTether(),
            //   // requestPricefeed: requestTradePricefeedTether()
            // })
          )
        }, combineObject({ position, collateralTokenPoolInfo, fundingRateFactor, stableFundingRateFactor, isLong, market, collateralToken,  }))
      ),

      switchMap(posList => {
        if (posList.length === 0) {
          return empty()
        }

        return $column(style({ flex: 1 }))(
          ...posList.map(pos => {

            const positionMarkPrice = latestTokenPrice(config.processData, now(pos.indexToken))
            const cumulativeFee = vault.read('cumulativeFundingRates', pos.collateralToken)
            const pnl = map(params => {
              const delta = getPnL(pos.isLong, pos.averagePrice, params.positionMarkPrice.min, pos.size)

              return pos.realisedPnl + delta - pos.cumulativeFee
            }, combineObject({ positionMarkPrice, cumulativeFee }))


            return switchLatest(map(currentPost => {
              if (currentPost === null || currentPost.key === pos.key) {
                return empty()
              }

              return $row(layoutSheet.spacing,
                style({
                  [screenUtils.isDesktopScreen ? 'borderTop' : 'borderBottom']: `1px solid ${colorAlpha(pallete.foreground, .20)}`,
                  padding: '16px', placeContent: 'space-between', borderRadius: '20px', backgroundColor: pallete.background,
                })
              )(
                $ButtonPrimary({
                  $content: $entry(pos),
                  $container: $defaultMiniButtonSecondary
                })({
                  click: switchTradeTether(
                    constant(pos)
                  )
                }),
                $sizeAndLiquidation(pos.isLong, pos.size, pos.collateral, pos.averagePrice, positionMarkPrice),
                $infoTooltipLabel(
                  $openPositionPnlBreakdown(pos, cumulativeFee),
                  $pnlValue(pnl)
                ),
              )
            }, position))
          })
        )

      }, config.openPositionList)
    ),

    {
      switchTrade,
      clickResetPosition,
      requestTrade,
      enableTrading: mergeArray([
        approveTrading,
        filterNull(awaitPromises(map(async (ctx) => {
          try {
            await ctx
            return true
          } catch (err) {
            return null
          }
        }, requestEnablePlugin)))
      ]),
      approvePrimaryToken: filterNull(awaitPromises(map(async (ctx) => {
        try {
          await ctx
          return true
        } catch (err) {
          return null
        }
      }, requestApproveSpend))),

      // leverage: filterNull(snapshot(state => {
      //   if (state.position === null) {
      //     return null
      //   }

      //   return div(state.position.size, state.position.collateral - state.fundingFee)
      // }, combineObject({ position, fundingFee }), delay(50, clickResetPosition))),
      

    }
  ]
})



