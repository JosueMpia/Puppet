import { chain, constant, fromPromise, map, mergeArray, now, switchLatest } from "@most/core"
import { Stream } from "@most/types"
import { ILogEvent, ILogOrdered, ILogOrderedEvent, getEventOrderIdentifier, getblockOrderIdentifier, importGlobal, max, switchMap } from "gmx-middleware-utils"
import * as viem from "viem"
import { zipArray } from "../../logic/utils.js"
import * as indexDB from "../storage/indexDB.js"
import * as storeUtils from "../storage/storeScope.js"
import { transformBigints } from "../storage/storeScope.js"
import { IIndexEventLogScopeParams, fetchTradesRecur } from "./rpc.js"


export enum IProcessEnvironmentMode {
  DEV,
  PROD,
}

export interface IProcessedStoreConfig {
  startBlock: bigint
  endBlock: bigint
  chainId: number
}

export interface IProcessedStore<T> {
  state: T
  config: IProcessedStoreConfig
  orderId: number
  blockNumber: bigint
  // sourceUrl: string
}


export interface IProcessSourceConfig<TLog extends ILogOrdered, TState> {
  queryBlockRange?: bigint
  source: IIndexEventLogScopeParams<TLog, any, any>
  step: (seed: TState, value: TLog) => TState
}


export interface IProcessorConfig<TState, TParentName extends string> {
  queryBlockRange?: bigint
  seedFile?: Stream<IProcessedStore<TState>>,
  parentScope: storeUtils.IStoreconfig<TParentName>,
  mode: IProcessEnvironmentMode
  blueprint: Omit<IProcessedStore<TState>, 'orderId' | 'blockNumber'>,
}



export interface IProcessParams<TState, TProcessConfigList extends ILogOrdered[], TParentName extends string> extends IProcessorConfig<TState, TParentName> {
  scopeKey: string
  scope: storeUtils.IStoreScope<`${TParentName}.${string}`, any>
  processList: { [P in keyof TProcessConfigList]: IProcessSourceConfig<TProcessConfigList[P], TState> }
  store: Stream<IProcessedStore<TState>>,
}

export function defineProcess<TSeed, TProcessConfigList extends ILogOrdered[], TParentName extends string >(
  config: IProcessorConfig<TSeed, TParentName>,
  ...processList: { [P in keyof TProcessConfigList]: IProcessSourceConfig<TProcessConfigList[P], TSeed>; }
): IProcessParams<TSeed, TProcessConfigList, TParentName> {

  const scope = storeUtils.createStoreScope(config.parentScope, 'processor')
  const scopeKey = getProcessorKey(processList, config.blueprint.config)
  const storedIdbSeed: Stream<IProcessedStore<TSeed>> = indexDB.get(scope, scopeKey)

  const store = switchMap(storedState => {
    // if store is empty, fetch seed file
    // if seed file is invalid, bootstrap using blueprint
    if (!storedState) {
      return map(loadedSeedfile => {
        if (loadedSeedfile) {
          const seedFileValidationError = validateConfig(loadedSeedfile.config, config.blueprint.config)

          if (seedFileValidationError) {
            throw new Error(`Config file validation error: ${seedFileValidationError}. delete seed file to bootstrap from blueprint`)
          }
          return loadedSeedfile
        }

        const blockNumber = config.blueprint.config.startBlock
        const orderId = getblockOrderIdentifier(config.blueprint.config.startBlock)
        return { ...config.blueprint, blockNumber, orderId }
      }, config.seedFile || now(null))
    }

    return now(storedState)
  }, storedIdbSeed)

  
  return { ...config, processList, scope, store, scopeKey  }
}


export interface ISyncProcessParams<TSeed, TProcessConfigList extends ILogOrdered[], TParentName extends string> extends IProcessParams<TSeed, TProcessConfigList, TParentName> {
  publicClient: viem.PublicClient
  syncBlock: bigint
}


export function queryLogs<TSeed, TProcessConfigList extends ILogOrdered[], TParentName extends string>(
  config: ISyncProcessParams<TSeed, TProcessConfigList, TParentName>,
  processState: IProcessedStore<TSeed>
): Stream<ILogOrderedEvent[][]> {

  const nextLogBatch = config.processList.map(processConfig => {
    const rangeKey = IDBKeyRange.bound(
      processConfig.source.startBlock ? getblockOrderIdentifier(processConfig.source.startBlock) : processState.orderId,
      getblockOrderIdentifier(config.syncBlock), true
    )
    const nextStoredLog: Stream<ILogOrderedEvent[]> = indexDB.getRange(processConfig.source.scope, rangeKey)

    return switchMap(stored => {
      const lstEvent = stored[stored.length - 1] as ILogOrderedEvent | undefined
      const fromBlock = max(processState.blockNumber, lstEvent?.blockNumber || processConfig.source.startBlock || 0n)

      if (fromBlock > config.syncBlock) {
        throw new Error('fromBlock is greater than syncBlock')
      }


      const event = processConfig.source.abi.find((ev: any) => ev.type === 'event' && ev.name === processConfig.source.eventName)


      const next = fromBlock < config.syncBlock
        ? fetchTradesRecur(
          {
            ...processConfig.source,
            fromBlock: fromBlock,
            toBlock: config.syncBlock,
            publicClient: config.publicClient,
            rangeBlockQuery: processConfig.queryBlockRange,
          },
          reqParams => {
            const res = fromPromise(
              config.publicClient.getLogs({
                event,
                args: reqParams.args,
                address: reqParams.address,
                fromBlock: reqParams.fromBlock,
                strict: true,
                toBlock: reqParams.toBlock,
                // toBlock: min(reqParams.toBlock, reqParams.fromBlock + reqParams.rangeBlockQuery),
              })
            ) as Stream<ILogEvent[]>


            const storeMappedLogs = switchMap(logs => {
              const filtered = logs
                .map(ev => {
                  const storeObj = { ...ev, orderId: getEventOrderIdentifier(ev) } as ILogOrderedEvent
                  return storeObj
                })
                .filter(ev => {

                  return ev.orderId > Math.max(processState.orderId || 0, lstEvent ? lstEvent.orderId : 0)
                })

              return indexDB.add(processConfig.source.scope, filtered)
            }, res)

            return storeMappedLogs
          }
        )
        : now([])

      return map(nextLog => {
        return [...stored, ...nextLog]
      }, next)
    }, nextStoredLog)
  })
 
  
  return zipArray(
    (...nextLogEvents) => nextLogEvents,
    ...nextLogBatch
  )
}


export function processLogs<
  TSeed,
  TProcessConfigList extends ILogOrdered[],
  TParentName extends string
>(
  config: ISyncProcessParams<TSeed, TProcessConfigList, TParentName>,
  processState: IProcessedStore<TSeed>,
  nextLogBatch: Stream<ILogOrderedEvent[][]>
): Stream<IProcessedStore<TSeed>> {
 
  const sync = switchLatest(map(logBatchList => {
    const orderedNextEvents = logBatchList.flat().sort((a, b) => a.orderId - b.orderId)

    const nextState = orderedNextEvents.reduce((acc, next) => {
      const eventProcessor = config.processList.find((processConfig, idx) => {
        if ('eventName' in next) {
          return logBatchList[idx].indexOf(next) > -1
        }

        throw new Error('Event is not an ILogOrderedEvent')
      })

      if (!eventProcessor) {
        throw new Error('Event processor not found')
      }


      acc.orderId = next.orderId
      acc.blockNumber = next.blockNumber
      acc.state = eventProcessor.step(acc.state, next)

      return acc
    }, processState)

    nextState.blockNumber = config.syncBlock

    const setProcess = indexDB.set(config.scope, nextState, config.scopeKey)

    if (config.mode === IProcessEnvironmentMode.DEV) {
      return setProcess
    }

    const cleanProcessScopeList = config.processList.map(cfg => indexDB.clear(cfg.source.scope))
    
    
    return chain(state => {
      return constant(state, mergeArray(cleanProcessScopeList))
    }, setProcess)
  }, nextLogBatch))

  return sync
}

export function syncProcess<
  TSeed,
  TProcessConfigList extends ILogOrdered[],
  TParentName extends string
>(
  config: ISyncProcessParams<TSeed, TProcessConfigList, TParentName>,
  processState: IProcessedStore<TSeed>,
): Stream<IProcessedStore<TSeed>> {
  const nextLogBatch = queryLogs(config, processState)
  const sync = processLogs(config, processState, nextLogBatch)
  return sync
}



function getProcessorKey(processConfigList: IProcessSourceConfig<any, any>[], blueprint: IProcessedStoreConfig) {
  return processConfigList.reduce((acc, next) => {
    const shash = shortHash({ eventName: next.source.eventName, startBlock: String(next.source.startBlock), address: next.source.address, args: next.source.args })

    return `${acc}:${shash}`
  }, `${blueprint.chainId}:${blueprint.startBlock}:${blueprint.endBlock}`)
}

export function validateConfig(blueprintConfig: IProcessedStoreConfig, seedConfig: IProcessedStoreConfig): null | string {

  if (seedConfig.startBlock !== blueprintConfig.startBlock) {
    return `seed startBlock ${seedConfig.startBlock} does not match blueprint startBlock ${blueprintConfig.startBlock}`
  }

  if (seedConfig.endBlock !== blueprintConfig.endBlock) {
    return `seed endBlock ${seedConfig.endBlock} does not match blueprint endBlock ${blueprintConfig.endBlock}`
  }

  if (seedConfig.chainId !== blueprintConfig.chainId) {
    return `seed chainId ${seedConfig.chainId} does not match blueprint chainId ${blueprintConfig.chainId}`
  }

  return null
}

function shortHash(obj: object) {
  const str = JSON.stringify(obj)
        
  let h = 0
  for(let i = 0; i < str.length; i++)
    h = Math.imul(31, h) + str.charCodeAt(i) | 0

  return h.toString(16)
}