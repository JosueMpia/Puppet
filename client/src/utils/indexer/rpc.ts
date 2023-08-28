import { chain, delay, map, now, recoverWith } from "@most/core"
import { Stream } from "@most/types"
import { ILogOrdered, ILogOrderedEvent } from "gmx-middleware-utils"
import * as viem from "viem"
import * as store from "../storage/storeScope"


export type IIndexRpcEventLogConfig<
  _TLog extends ILogOrdered, // used to infer log type
  TAbi extends viem.Abi,
  TEventName extends string,
  TParentScopeName extends string = string,
> = {
  address: viem.Address
  eventName: viem.InferEventName<TAbi, TEventName>
  args?: any
  abi: TAbi,
  parentScope: store.IStoreconfig<TParentScopeName>
  startBlock?: bigint
}

export type IIndexEventLogScopeParams<
  TLog extends ILogOrdered,
  TAbi extends viem.Abi,
  TEventName extends string,
  TParentScopeName extends string = string,
> = IIndexRpcEventLogConfig<TLog, TAbi, TEventName, TParentScopeName> & {
  scope: store.IStoreScope<`${TParentScopeName}.${viem.InferEventName<TAbi, TEventName>}:${bigint}:0x${string}${string}`, { readonly keyPath: "orderId" }>
}

export function createRpcLogEventScope<
  TLog extends ILogOrderedEvent<TAbi, TEventName>,
  TAbi extends viem.Abi,
  TEventName extends string,
  TParentScopeName extends string = string,
>(config: IIndexRpcEventLogConfig<TLog, TAbi, TEventName, TParentScopeName>): IIndexEventLogScopeParams<TLog, TAbi, TEventName, TParentScopeName> {

  const shortArgsHash = config.args ? Object.entries(config.args).reduce((acc, [key, val]) => `${acc}:${getShortHash(key, val)}`, '') : ''
  const scopeName = `${config.eventName}:${config.startBlock || 0n}:${config.address}${shortArgsHash}` as const
  const scope = store.createStoreScope(config.parentScope, scopeName, { keyPath: 'orderId' } as const)
  
  return { ...config, scope }
}


export type IFilterLogsParams<
  TLog extends ILogOrderedEvent<TAbi, TEventName>,
  TAbi extends viem.Abi,
  TEventName extends string,
  TParentScopeName extends string = string,
> = IIndexEventLogScopeParams<TLog, TAbi, TEventName, TParentScopeName> & {
  rangeBlockQuery: bigint,
  fromBlock: bigint
  toBlock: bigint
  publicClient: viem.PublicClient
}

export const fetchTradesRecur = <
  TReturn extends ILogOrderedEvent<TAbi, TEventName>,
  TAbi extends viem.Abi,
  TEventName extends string,
  TParentScopeName extends string,
>(
  params: IFilterLogsParams<TReturn, TAbi, TEventName, TParentScopeName>,
  getList: (req: IFilterLogsParams<TReturn, TAbi, TEventName, TParentScopeName>) => Stream<TReturn[]>
): Stream<TReturn[]> => {

  let retryAmount = 0
  let delayTime = 0

  const nextBatchResponse = chain(res => {
    const nextToBlock = params.fromBlock + params.rangeBlockQuery

    if (nextToBlock >= params.toBlock) {
      return now(res)
    }

    const newPage = fetchTradesRecur({ ...params, fromBlock: nextToBlock }, getList)

    return map(nextPage => {
      return [...res, ...nextPage]
    }, newPage)
  }, getList(params))



  return recoverWith<TReturn[], Error & { code: number }, TReturn[]>((err): Stream<TReturn[]> => {
    delayTime += 1000
    const delayEvent = delay(delayTime, now(null))

    if (err.code !== -32602 || retryAmount > 3) {
      throw err
    }

    retryAmount++
    const reducedRange = params.rangeBlockQuery / 3n

    return chain(() => fetchTradesRecur({ ...params, rangeBlockQuery: reducedRange }, getList), delayEvent)
  }, nextBatchResponse)
}


function getShortHash(name: string, obj: any) {
  const str = JSON.stringify(obj)
  let hash = 0

  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash) + str.charCodeAt(i)
    hash |= 0 // Convert to 32bit integer
  }
    
  return `${name}-${hash.toString(16)}`
}


