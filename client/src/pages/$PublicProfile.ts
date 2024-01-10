import { Behavior, combineObject } from "@aelea/core"
import { $node, $text, component, style } from "@aelea/dom"
import * as router from '@aelea/router'
import { $column, layoutSheet } from "@aelea/ui-components"
import { fromPromise, map, mergeArray, now } from "@most/core"
import * as GMX from 'gmx-middleware-const'
import { $ButtonToggle, $defaulButtonToggleContainer } from "gmx-middleware-ui-components"
import { ETH_ADDRESS_REGEXP, switchMap } from "gmx-middleware-utils"
import * as viem from 'viem'
import { $PuppetProfile } from "../components/participant/$Puppet.js"
import { $TraderProfile } from "../components/participant/$Trader.js"
import { IChangeSubscription } from "../components/portfolio/$RouteSubscriptionEditor.js"
import * as storage from "../utils/storage/storeScope.js"
import { ISetRouteType, queryLatestPriceTick } from "puppet-middleware-utils"
import { Stream } from "@most/types"
import * as storeDb from "../data/store/store.js"


export enum IProfileActiveTab {
  TRADER = 'Trader',
  PUPPET = 'Puppet',
}

export interface IProfile {
  route: router.Route
  routeTypeList: Stream<ISetRouteType[]>
}


type IRouteOption = {
  label: string
  fragment: string
}


export const $PublicProfile = (config: IProfile) => component((
  [changeRoute, changeRouteTether]: Behavior<string, string>,
  [selectProfileMode, selectProfileModeTether]: Behavior<IRouteOption, IRouteOption>,
  [modifySubscriber, modifySubscriberTether]: Behavior<IChangeSubscription>,
  [changeActivityTimeframe, changeActivityTimeframeTether]: Behavior<any, GMX.IntervalTime>,
  
) => {

  const { route, routeTypeList } = config

  const profileAddressRoute = config.route
  const traderRoute = profileAddressRoute.create({ fragment: 'trader' }).create({ title: 'Trader', fragment: ETH_ADDRESS_REGEXP })
  const puppetRoute = profileAddressRoute.create({ fragment: 'puppet' }).create({ title: 'Puppet', fragment: ETH_ADDRESS_REGEXP })

  const activityTimeframe = storage.replayWrite(storeDb.store.global, changeActivityTimeframe, 'activityTimeframe')
  const priceTickMap = switchMap(params => {
    return fromPromise(queryLatestPriceTick({ activityTimeframe: params.activityTimeframe }, 50))
  }, combineObject({ activityTimeframe }))
  
  const options: IRouteOption[] = [
    {
      label: 'Puppet',
      fragment: 'puppet'
    },
    {
      label: 'Trader',
      fragment: 'trader'
    },
  ]



  return [

    $column(layoutSheet.spacingBig)(

      $node(),

      $column(layoutSheet.spacingBig, style({ alignItems: 'center', placeContent: 'center' }))(
        $ButtonToggle({
          $container: $defaulButtonToggleContainer(style({ alignSelf: 'center', })),
          selected: mergeArray([
            router.match<IRouteOption>(puppetRoute)(now(options[0])),
            router.match<IRouteOption>(traderRoute)(now(options[1])),
          ]),
          options,
          $$option: map(option => {
            return $text(option.label)
          })
        })({ select: selectProfileModeTether() }),
      ),
     
      {
        run(sink, scheduler) {
          const urlFragments = document.location.pathname.split('/')
          const address = viem.getAddress(urlFragments[urlFragments.length - 1])

          return  $column(
            router.match(traderRoute)(
              $TraderProfile({ priceTickMap, route, address, activityTimeframe })({
                modifySubscriber: modifySubscriberTether(),
                changeRoute: changeRouteTether(),
                changeActivityTimeframe: changeActivityTimeframeTether(),
              })
            ),
            router.match(puppetRoute)(
              $PuppetProfile({ activityTimeframe, address, priceTickMap, route, routeTypeList })({
                changeRoute: changeRouteTether(),
                changeActivityTimeframe: changeActivityTimeframeTether(),
                modifySubscriber: modifySubscriberTether()
              })
            ),
          ).run(sink, scheduler)
        },
      },
      
      $node(),
      $node(),

    ),

    {
      changeRoute: mergeArray([
        changeRoute,
        map(option => {
          const urlFragments = document.location.pathname.split('/')
          const address = urlFragments[urlFragments.length - 1] as viem.Address
          const url = `/app/profile/${option.fragment}/${address}`
          history.pushState({}, '', url)
          return url
        }, selectProfileMode)
      ]),
      modifySubscriber
    }
  ]
})


