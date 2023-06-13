import { Behavior } from "@aelea/core"
import { $element, $node, $text, component, eventElementTarget, style } from "@aelea/dom"
import * as router from '@aelea/router'
import { $column, $row, designSheet, layoutSheet, screenUtils } from '@aelea/ui-components'
import { pallete } from "@aelea/ui-components-theme"
import { BLUEBERRY_REFFERAL_CODE } from "@gambitdao/gbc-middleware"
import { map, merge, mergeArray, multicast, now, skipRepeats, startWith } from '@most/core'
import { ARBITRUM_ADDRESS, AVALANCHE_ADDRESS, CHAIN } from "gmx-middleware-const"
import { ETH_ADDRESS_REGEXP } from "gmx-middleware-utils"
import { Address } from "viem"
import { $discoverIdentityDisplay } from "../components/$AccountProfile"
import { $IntermediateConnectButton } from "../components/$ConnectAccount"
import { $MainMenu, $MainMenuMobile } from '../components/$MainMenu'
import * as database from "../logic/database"
import { helloBackend } from '../logic/websocket'
import { fadeIn } from "../transitions/enter"
import { $Home } from "./$Home"
import { $Profile } from "./$Profile"
import { $ProfileConnected } from "./$ProfileConnected"
import { $Trade } from "./$Trade"
import { $Leaderboard } from "./competition/$Leaderboard"
import { $PuppetPortfolio } from "./$Puppet"




const popStateEvent = eventElementTarget('popstate', window)
const initialLocation = now(document.location)
const requestRouteChange = merge(initialLocation, popStateEvent)
const locationChange = map((location) => {
  return location
}, requestRouteChange)

interface Website {
  baseRoute?: string
}

export const $Main = ({ baseRoute = '' }: Website) => component((
  [routeChanges, linkClickTether]: Behavior<any, string>,
  // [resizeScreen, resizeScreenTether]: Behavior<any, ResizeObserverEntry[]>,
) => {

  const changes = merge(locationChange, multicast(routeChanges))
  const fragmentsChange = map(() => {
    const trailingSlash = /\/$/
    const relativeUrl = location.href.replace(trailingSlash, '').split(document.baseURI.replace(trailingSlash, ''))[1]
    const frags = relativeUrl.split('/')
    frags.splice(0, 1, baseRoute)
    return frags
  }, changes)


  const rootRoute = router.create({ fragment: baseRoute, title: 'GMX Blueberry Club', fragmentsChange })
  const appRoute = rootRoute.create({ fragment: 'app', title: '' })
  const profileRoute = appRoute.create({ fragment: 'profile', title: 'Berry Account' }).create({ fragment: ETH_ADDRESS_REGEXP })
  const profileWalletRoute = appRoute.create({ fragment: 'wallet', title: 'Wallet Account' })
  const leaderboardRoute = appRoute.create({ fragment: 'leaderboard', title: 'Leaderboard' })
  const TRADEURL = 'trade'
  const tradeRoute = appRoute.create({ fragment: TRADEURL })
  const tradeTermsAndConditions = appRoute.create({ fragment: 'trading-terms-and-conditions' })




  const serverApi = helloBackend({
    // requestPricefeed,
    // requestLatestPriceMap,
    // requestTrade,
    // requestAccountTradeList
  })







  const $liItem = $element('li')(style({ marginBottom: '14px' }))


  const $rootContainer = $column(
    designSheet.main,
    style({
      color: pallete.message,
      fill: pallete.message,
      position: 'relative',
      // backgroundImage: `radial-gradient(570% 71% at 50% 15vh, ${pallete.background} 0px, ${pallete.horizon} 100%)`,
      backgroundColor: pallete.horizon,
      fontSize: '1.25em',
      minHeight: '100vh',
      fontWeight: 400,
      overflowX: 'hidden',
      padding: '0 15px',
      flexDirection: 'row',
    })
  )

  const isMobileScreen = skipRepeats(map(() => document.body.clientWidth > 1440 + 280, startWith(null, eventElementTarget('resize', window))))


  return [

    mergeArray([
      router.match(rootRoute)(
        $rootContainer(
          style({
            scrollSnapType: 'y mandatory',
            margin: '0 auto', width: '100%'
          })
        )(
          $Home({
            parentRoute: rootRoute,
          })({ routeChanges: linkClickTether() })

        )
      ),
      router.contains(appRoute)(
        $rootContainer(
          screenUtils.isDesktopScreen
            ? style({
              display: 'flex', flexDirection: 'row',
            })
            : style({
              display: 'flex', flexDirection: 'column',
              gap: '35px',
            })
        )(
          screenUtils.isDesktopScreen
            ? $MainMenu({ parentRoute: rootRoute, chainList: [CHAIN.ARBITRUM, CHAIN.AVALANCHE] })({
              routeChange: linkClickTether(),
            })
            : $MainMenuMobile({ parentRoute: rootRoute, chainList: [CHAIN.ARBITRUM, CHAIN.AVALANCHE] })({
              routeChange: linkClickTether(),
            }),

          $column(
            layoutSheet.spacingBig,
            // styleBehavior(map(isMobile => ({ flexDirection: isMobile ? 'row' : 'column' }), isMobileScreen)),
            style({ margin: '0 auto', maxWidth: '1440px', paddingTop: screenUtils.isDesktopScreen ? '55px' : '', gap: screenUtils.isDesktopScreen ? '55px' : '55px', width: '100%' })
          )(

            router.match(appRoute)(
              fadeIn($PuppetPortfolio({
                parentRoute: profileWalletRoute,
                chainList: [CHAIN.ARBITRUM]
              })({
                changeRoute: linkClickTether(),
              }))
            ),

            // switchMap(isMobile => {
            //   if (isMobile) {
            //     return $MainMenu({ parentRoute: rootRoute, chainList: [CHAIN.ARBITRUM, CHAIN.AVALANCHE] })({
            //       routeChange: linkClickTether(),
            //     })
            //   }

            //   return $MainMenuSmall({ parentRoute: rootRoute, chainList: [CHAIN.ARBITRUM, CHAIN.AVALANCHE] })({
            //     routeChange: linkClickTether(),
            //   })
            // }, isMobileScreen),

            router.contains(profileRoute)(
              {
                run(sink, scheduler) {
                  const urlFragments = document.location.pathname.split('/')
                  const account = urlFragments[urlFragments.length - 2].toLowerCase() as Address

                  return $Profile({
                    $accountDisplay: $row(layoutSheet.spacing, style({ flex: 1, alignItems: 'center', placeContent: 'center', zIndex: 1 }))(
                      $discoverIdentityDisplay({
                        address: account,
                        labelSize: '1.5em'
                      }),
                    ),
                    account: account,
                    parentUrl: `/app/profile/${account}/`,
                    parentRoute: profileRoute
                  })({
                    changeRoute: linkClickTether(),
                  }).run(sink, scheduler)
                },
              }
            ),
            router.contains(profileWalletRoute)(
              fadeIn($ProfileConnected({
                parentRoute: profileWalletRoute,
                chainList: [CHAIN.ARBITRUM]
              })({
                changeRoute: linkClickTether(),
              }))
            ),
            router.match(leaderboardRoute)(
              fadeIn($Leaderboard({
                parentRoute: appRoute
              })({
                routeChange: linkClickTether()
              }))
            ),
            router.match(tradeRoute)(
              $IntermediateConnectButton({
                $$display: map(wallet => {

                  return $Trade({
                    chain: wallet.chain,
                    referralCode: BLUEBERRY_REFFERAL_CODE,
                    tokenIndexMap: {
                      [CHAIN.ARBITRUM]: [
                        ARBITRUM_ADDRESS.NATIVE_TOKEN,
                        ARBITRUM_ADDRESS.WBTC,
                        ARBITRUM_ADDRESS.LINK,
                        ARBITRUM_ADDRESS.UNI,
                      ],
                      [CHAIN.AVALANCHE]: [
                        AVALANCHE_ADDRESS.NATIVE_TOKEN,
                        AVALANCHE_ADDRESS.WETHE,
                        AVALANCHE_ADDRESS.WBTCE,
                        AVALANCHE_ADDRESS.BTCB,
                      ]
                    },
                    tokenStableMap: {
                      [CHAIN.ARBITRUM]: [
                        ARBITRUM_ADDRESS.USDC,
                        ARBITRUM_ADDRESS.USDT,
                        ARBITRUM_ADDRESS.DAI,
                        ARBITRUM_ADDRESS.FRAX,
                        // ARBITRUM_ADDRESS.MIM,
                      ],
                      [CHAIN.AVALANCHE]: [
                        AVALANCHE_ADDRESS.USDC,
                        AVALANCHE_ADDRESS.USDCE,
                        // AVALANCHE_ADDRESS.MIM,
                      ]
                    },
                    parentRoute: tradeRoute
                  })({
                    changeRoute: linkClickTether()
                  })
                })
              })({})
            ),
            router.match(tradeTermsAndConditions)(
              $column(layoutSheet.spacing, style({ maxWidth: '680px', alignSelf: 'center' }))(
                $text(style({ fontSize: '3em', textAlign: 'center' }))('GBC Trading'),
                $node(),
                $text(style({ fontSize: '1.5em', textAlign: 'center', fontWeight: 'bold' }))('Terms And Conditions'),
                $text(style({ whiteSpace: 'pre-wrap' }))(`By accessing, I agree that ${document.location.host + '/app/' + TRADEURL} is an interface (hereinafter the "Interface") to interact with external GMX smart contracts, and does not have access to my funds. I represent and warrant the following:`),
                $element('ul')(layoutSheet.spacing, style({ lineHeight: '1.5em' }))(
                  $liItem(
                    $text(`I am not a United States person or entity;`),
                  ),
                  $liItem(
                    $text(`I am not a resident, national, or agent of any country to which the United States, the United Kingdom, the United Nations, or the European Union embargoes goods or imposes similar sanctions, including without limitation the U.S. Office of Foreign Asset Control, Specifically Designated Nationals and Blocked Person List;`),
                  ),
                  $liItem(
                    $text(`I am legally entitled to access the Interface under the laws of the jurisdiction where I am located;`),
                  ),
                  $liItem(
                    $text(`I am responsible for the risks using the Interface, including, but not limited to, the following: (i) the use of GMX smart contracts; (ii) leverage trading, the risk may result in the total loss of my deposit.`),
                  ),
                ),

                $node(style({ height: '100px' }))(),

              ),

            ),

          )
        )
      ),
    ])

  ]
})

