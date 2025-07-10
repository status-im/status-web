/**
 * @see https://dashboard.alchemy.com for usage
 * @see https://docs.alchemy.com/reference/api-overview for documentation
 * @see https://www.alchemy.com/pricing for pricing
 * @see https://docs.alchemy.com/reference/compute-unit-costs for Compute Unit costs
 */

// import 'server-only'

import retry from 'async-retry'
import { formatEther } from 'ethers'

import { serverEnv } from '../../../config/env.server.mjs'
import { getNativeTokenPrice } from '../coingecko'
import { estimateConfirmationTime, processFeeHistory } from './utils'

import type { NetworkType } from '../../api/types'
import type {
  AssetTransfer,
  BlockResponseBody,
  deprecated_NFTSaleResponseBody,
  ERC20TokenBalanceResponseBody,
  FeeHistoryResponseBody,
  GasEstimateResponseBody,
  MaxPriorityFeeResponseBody,
  NativeTokenBalanceResponseBody,
  NFTFloorPriceResponseBody,
  NFTMetadataResponseBody,
  NFTsResponseBody,
  ResponseBody,
  SendRawTransactionResponseBody,
  TokenBalanceHistoryResponseBody,
  TransactionCountResponseBody,
} from './types'

const alchemyNetworks = {
  ethereum: 'eth-mainnet',
  optimism: 'opt-mainnet',
  arbitrum: 'arb-mainnet',
  base: 'base-mainnet',
  polygon: 'polygon-mainnet',
  bsc: 'bnb-mainnet',
}

const unsupportedCategoriesByNetwork: Partial<Record<NetworkType, string[]>> = {
  // bsc: ['internal'],
  // arbitrum: ['internal'],
  // base: ['internal'],
  // optimism: ['internal'],
}

const allCategories = [
  'external',
  'internal',
  'erc20',
  'erc721',
  'erc1155',
  'specialnft',
] as const

// todo: use `genesisTimestamp` for `all` days parame
// const networkConfigs = {
//   ethereum: {
//     averageBlockTime: 12,
//     /**
//      * @see https://etherscan.io/block/0
//      */
//     genesisTimestamp: 1438269973, // Jul-30-2015 03:26:13 PM +UTC
//   },
//   optimism: {
//     averageBlockTime: 2,
//     /**
//      * @see https://optimistic.etherscan.io/block/0
//      */
//     genesisTimestamp: 1610640700,
//   },
//   arbitrum: {
//     averageBlockTime: 0.25,
//     /**
//      * @see https://arbiscan.io/block/0
//      */
//     genesisTimestamp: 1622240000,
//   },
// }

/**
 * 19 CU per request https://docs.alchemy.com/reference/compute-unit-costs#standard-evm-json-rpc-methods-ethereum-polygon-pos-polygon-zkevm-optimism-arbitrum-zksync-base-astar
 */
export async function getNativeTokenBalance(
  address: string,
  network: NetworkType,
) {
  const url = new URL(
    `https://${alchemyNetworks[network]}.g.alchemy.com/v2/${serverEnv.ALCHEMY_API_KEY}`,
  )
  const body = await _retry(async () =>
    _fetch<NativeTokenBalanceResponseBody>(url, 'POST', 15, {
      id: 1,
      jsonrpc: '2.0',
      method: 'eth_getBalance',
      params: [address, 'latest'],
    }),
  )

  const balance = body.result

  return balance
}

/**
 * @see https://docs.alchemy.com/reference/alchemy-gettokenbalances
 *
 * 26 CU per request https://docs.alchemy.com/reference/compute-unit-costs#token-api
 */
export async function getERC20TokensBalance(
  address: string,
  network: NetworkType,
  contracts: string[],
) {
  if (contracts.length > 100) {
    throw new Error('Too many contracts')
  }
  const url = new URL(
    `https://${alchemyNetworks[network]}.g.alchemy.com/v2/${serverEnv.ALCHEMY_API_KEY}`,
  )

  const body = await _retry(async () =>
    _fetch<ERC20TokenBalanceResponseBody>(url, 'POST', 15, {
      jsonrpc: '2.0',
      method: 'alchemy_getTokenBalances',
      params: [address, contracts],
    }),
  )

  const balances = body.result.tokenBalances

  return balances
}

/**
 * @see https://docs.alchemy.com/reference/alchemy-getassettransfers
 *
 * 150 CU per request https://docs.alchemy.com/reference/compute-unit-costs#transfers-api
 */
export async function fetchTokenBalanceHistory(
  address: string,
  network: NetworkType,
  days: '1' | '7' | '30' | '90' | '365' | 'all' = '1',
  contract?: string,
  currentTime?: number,
) {
  const transfers: TokenBalanceHistoryResponseBody['result']['transfers'] = []

  {
    const response = await fetch(
      `https://${alchemyNetworks[network]}.g.alchemy.com/v2/${serverEnv.ALCHEMY_API_KEY}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          jsonrpc: '2.0',
          method: 'alchemy_getAssetTransfers',
          params: [
            {
              fromBlock: '0x0',
              toBlock: 'latest',
              toAddress: address,
              category: [contract ? 'erc20' : 'external'],
              order: 'desc',
              withMetadata: true,
              excludeZeroValue: true,
              maxCount: '0x3e8',
              ...(contract && { contractAddresses: [contract] }),
            },
          ],
        }),
        next: {
          revalidate: 3600,
        },
      },
    )

    const body: TokenBalanceHistoryResponseBody = await response.json()

    transfers.push(...body.result.transfers)
  }

  await new Promise(resolve => setTimeout(resolve, 1000))

  {
    const response = await fetch(
      `https://${alchemyNetworks[network]}.g.alchemy.com/v2/${serverEnv.ALCHEMY_API_KEY}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          jsonrpc: '2.0',
          method: 'alchemy_getAssetTransfers',
          params: [
            {
              fromBlock: '0x0',
              toBlock: 'latest',
              fromAddress: address,
              category: [contract ? 'erc20' : 'external'],
              order: 'desc',
              withMetadata: true,
              excludeZeroValue: true,
              maxCount: '0x3e8',
              ...(contract && { contractAddresses: [contract] }),
            },
          ],
        }),
        next: {
          revalidate: 3600,
        },
      },
    )

    const body: TokenBalanceHistoryResponseBody = await response.json()

    transfers.push(...body.result.transfers)
  }

  await new Promise(resolve => setTimeout(resolve, 1000))

  if (!transfers.length) {
    return []
  }

  transfers.sort(
    (a, b) =>
      new Date(b.metadata.blockTimestamp).getTime() -
      new Date(a.metadata.blockTimestamp).getTime(),
  )

  const uniqueTransfers = transfers.filter(
    (transfer, index, array) =>
      array.findIndex(
        t =>
          t.hash === transfer.hash &&
          t.metadata.blockTimestamp === transfer.metadata.blockTimestamp &&
          t.value === transfer.value,
      ) === index,
  )

  const now = Math.floor(Date.now() / (1000 * 3600)) * 3600
  const hoursInPeriod = Number(days) * 24
  const requestedStartTime = now - (hoursInPeriod - 1) * 3600

  if (uniqueTransfers.length === 0) {
    return []
  }

  const earliestTransferTime = Math.min(
    ...uniqueTransfers.map(
      t => new Date(t.metadata.blockTimestamp).getTime() / 1000,
    ),
  )

  const timestamps = Array.from(
    { length: hoursInPeriod },
    (_, i) => requestedStartTime + i * 3600,
  )
  timestamps.push(currentTime || Date.now() / 1000)

  timestamps.reverse()

  let balance: string
  if (contract) {
    balance = (await getERC20TokensBalance(address, network, [contract]))[0]
      .tokenBalance
  } else {
    balance = await getNativeTokenBalance(address, network)
  }

  // fixme: use token's decimals
  const latestBalance = Number(balance) / 1e18

  let currentBalance = latestBalance
  let transferIndex = 0

  const data = timestamps.map((timestamp, index) => {
    if (index === 0) {
      return {
        date: new Date(timestamp * 1000).toISOString(),
        price: latestBalance,
      }
    }

    if (timestamp < earliestTransferTime) {
      return {
        date: new Date(timestamp * 1000).toISOString(),
        price: 0,
      }
    }

    while (
      transferIndex < uniqueTransfers.length &&
      new Date(
        uniqueTransfers[transferIndex].metadata.blockTimestamp,
      ).getTime() /
        1000 >
        timestamp
    ) {
      const transfer = uniqueTransfers[transferIndex]
      const amount = Number(transfer.value)

      if (transfer.to.toLowerCase() === address.toLowerCase()) {
        currentBalance -= amount
      } else {
        currentBalance += amount
      }

      transferIndex++
    }

    const balanceAtTime = Math.max(0, currentBalance)

    return {
      date: new Date(timestamp * 1000).toISOString(),
      // balance: balanceAtTime,
      // fixme: naming price until chart supports balance
      price: balanceAtTime,
    }
  })

  return data
}

/**
 * @see https://docs.alchemy.com/reference/getnftsforowner-v3
 *
 * 600 CU per request https://docs.alchemy.com/reference/compute-unit-costs#nft-api
 * 100 Throughput CU per second
 */
export async function getNFTs(
  address: string,
  network: NetworkType,
  page?: string,
  pageSize?: string,
) {
  const url = new URL(
    `https://${alchemyNetworks[network]}.g.alchemy.com/nft/v3/${serverEnv.ALCHEMY_API_KEY}/getNFTsForOwner`,
  )
  url.searchParams.set('owner', address)
  url.searchParams.set('withMetadata', 'true')
  url.searchParams.set('pageSize', pageSize ?? '100')
  if (page) {
    url.searchParams.set('pageKey', page)
  }

  const body = await _retry(async () =>
    _fetch<NFTsResponseBody>(url, 'GET', 15),
  )

  return body
}
/**
 * @see https://docs.alchemy.com/reference/getnftmetadata-v3
 *
 * 100 CU per request https://docs.alchemy.com/reference/compute-unit-costs#nft-api
 * 10 Throughput CU per second
 */
export async function getNFTMetadata(
  contract: string,
  tokenId: string,
  network: NetworkType,
) {
  const url = new URL(
    `https://${alchemyNetworks[network]}.g.alchemy.com/nft/v3/${serverEnv.ALCHEMY_API_KEY}/getNFTMetadata`,
  )
  url.searchParams.set('contractAddress', contract)
  url.searchParams.set('tokenId', tokenId)

  const body = await _retry(async () =>
    _fetch<NFTMetadataResponseBody>(url, 'GET', 3600),
  )

  return body
}

export async function getLatestBlockNumber(
  network: NetworkType,
): Promise<number> {
  const url = `https://${alchemyNetworks[network]}.g.alchemy.com/v2/${serverEnv.ALCHEMY_API_KEY}`

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      jsonrpc: '2.0',
      method: 'eth_blockNumber',
      params: [],
      id: 1,
    }),
  })

  const data = await res.json()

  if (!data.result) {
    throw new Error(`Failed to fetch latest block number for ${network}`)
  }

  return parseInt(data.result, 16)
}

/**
 * @see https://www.alchemy.com/docs/data/transfers-api/transfers-endpoints/alchemy-get-asset-transfers
 *
 * 120 CU per request https://www.alchemy.com/docs/reference/compute-unit-costs#transfers-api
 */
export async function getOutgoingAssetTransfers(
  fromAddress: string,
  network: NetworkType,
  pageKey?: string,
  limit: number = 100,
) {
  const supportedCategories = allCategories.filter(
    category => !unsupportedCategoriesByNetwork[network]?.includes(category),
  )

  const url = new URL(
    `https://${alchemyNetworks[network]}.g.alchemy.com/v2/${serverEnv.ALCHEMY_API_KEY}`,
  )

  const params: {
    category: (typeof allCategories)[number][]
    fromAddress: string
    excludeZeroValue: boolean
    withMetadata: boolean
    order: 'asc' | 'desc'
    maxCount: string
    pageKey?: string
  } = {
    category: supportedCategories,
    fromAddress,
    excludeZeroValue: true,
    withMetadata: true,
    order: 'desc',
    maxCount: `0x${limit.toString(16)}`,
  }

  if (pageKey) {
    params.pageKey = pageKey
  }

  const body = await _retry(async () =>
    _fetch<
      TokenBalanceHistoryResponseBody & {
        result: {
          transfers: TokenBalanceHistoryResponseBody['result']['transfers']
          pageKey?: string
        }
      }
    >(url, 'POST', 3600, {
      jsonrpc: '2.0',
      method: 'alchemy_getAssetTransfers',
      params: [params, 'latest'],
      id: Date.now(),
    }),
  )

  if ('error' in body) {
    console.error('[Alchemy Error]', body.error)
    throw new Error(`Alchemy API Error`)
  }

  const result = body.result

  if (!result?.transfers) {
    console.error('[Alchemy Warning] Missing transfers in response:', result)
    return { transfers: [], pageKey: undefined }
  }

  result.transfers.sort((a, b) => {
    // First sort by block number (newest first)
    const blockDiff = parseInt(b.blockNum, 16) - parseInt(a.blockNum, 16)
    if (blockDiff !== 0) return blockDiff

    // If same block, sort by timestamp (newest first)
    const timestampA = new Date(a.metadata.blockTimestamp).getTime()
    const timestampB = new Date(b.metadata.blockTimestamp).getTime()
    return timestampB - timestampA
  })

  return {
    transfers: result.transfers,
    pageKey: result.pageKey, // undefined if last page
  }
}

/**
 * Get incoming asset transfers (transactions sent TO an address)
 *
 * @see https://docs.alchemy.com/reference/alchemy-gettransfers
 */
export async function getIncomingAssetTransfers(
  toAddress: string,
  network: NetworkType,
  pageKey?: string,
  limit: number = 100,
) {
  const supportedCategories = allCategories.filter(
    category => !unsupportedCategoriesByNetwork[network]?.includes(category),
  )

  const url = new URL(
    `https://${alchemyNetworks[network]}.g.alchemy.com/v2/${serverEnv.ALCHEMY_API_KEY}`,
  )

  const params: {
    category: (typeof allCategories)[number][]
    toAddress: string
    excludeZeroValue: boolean
    withMetadata: boolean
    maxCount: string
    order: 'desc'
    pageKey?: string
  } = {
    category: supportedCategories,
    toAddress,
    excludeZeroValue: true,
    withMetadata: true,
    maxCount: `0x${limit.toString(16)}`,
    order: 'desc',
  }

  if (pageKey) {
    params.pageKey = pageKey
  }

  const body = await _retry(async () =>
    _fetch<
      TokenBalanceHistoryResponseBody & {
        result: {
          transfers: TokenBalanceHistoryResponseBody['result']['transfers']
          pageKey?: string
        }
      }
    >(url, 'POST', 3600, {
      jsonrpc: '2.0',
      method: 'alchemy_getAssetTransfers',
      params: [params, 'latest'],
      id: Date.now(),
    }),
  )

  if ('error' in body) {
    console.error('[Alchemy Error]', body.error)
    throw new Error(`Alchemy API Error`)
  }

  const result = body.result

  if (!result?.transfers) {
    console.error('[Alchemy Warning] Missing transfers in response:', result)
    return { transfers: [], pageKey: undefined }
  }

  result.transfers.sort((a, b) => {
    // First sort by block number (newest first)
    const blockDiff = parseInt(b.blockNum, 16) - parseInt(a.blockNum, 16)
    if (blockDiff !== 0) return blockDiff

    // If same block, sort by timestamp (newest first)
    const timestampA = new Date(a.metadata.blockTimestamp).getTime()
    const timestampB = new Date(b.metadata.blockTimestamp).getTime()
    return timestampB - timestampA
  })

  return {
    transfers: result.transfers,
    pageKey: result.pageKey,
  }
}

type TransferBuffer = {
  incoming: AssetTransfer[]
  outgoing: AssetTransfer[]
  incomingPageKey?: string
  outgoingPageKey?: string
  hasReachedEnd: {
    incoming: boolean
    outgoing: boolean
  }
}

const transferBuffers = new Map<string, TransferBuffer>()

export async function getAssetTransfers(
  address: string,
  network: NetworkType,
  pageKey?: string,
  limit: number = 20,
) {
  try {
    const cacheKey = `${address.toLowerCase()}-${network}`
    let buffer = transferBuffers.get(cacheKey)

    if (!pageKey || !buffer) {
      buffer = {
        incoming: [],
        outgoing: [],
        hasReachedEnd: { incoming: false, outgoing: false },
      }
      transferBuffers.set(cacheKey, buffer)
    }

    let incomingPageKey: string | undefined
    let outgoingPageKey: string | undefined

    if (pageKey) {
      try {
        const parsed = JSON.parse(pageKey)
        if (parsed) {
          incomingPageKey = parsed.incoming
          outgoingPageKey = parsed.outgoing
        }
      } catch {
        incomingPageKey = buffer.incomingPageKey
        outgoingPageKey = buffer.outgoingPageKey
      }
    }

    const needsFetch =
      buffer.incoming.length < limit || buffer.outgoing.length < limit

    if (
      needsFetch &&
      (!buffer.hasReachedEnd.incoming || !buffer.hasReachedEnd.outgoing)
    ) {
      const isOutgoingFetching =
        !buffer.hasReachedEnd.outgoing && buffer.outgoing.length < limit
      const isIncomingFetching =
        !buffer.hasReachedEnd.incoming && buffer.incoming.length < limit

      const [outgoingResult, incomingResult] = await Promise.all([
        isOutgoingFetching
          ? getOutgoingAssetTransfers(
              address,
              network,
              outgoingPageKey || buffer.outgoingPageKey,
              limit,
            )
          : { transfers: [], pageKey: undefined },
        isIncomingFetching
          ? getIncomingAssetTransfers(
              address,
              network,
              incomingPageKey || buffer.incomingPageKey,
              limit,
            )
          : { transfers: [], pageKey: undefined },
      ])

      buffer.incoming.push(
        ...incomingResult.transfers.map(t => ({
          ...t,
          tokenId: t.tokenId ?? undefined,
          erc721TokenId: t.erc721TokenId ?? undefined,
          erc1155Metadata: t.erc1155Metadata ?? undefined,
        })),
      )
      buffer.outgoing.push(
        ...outgoingResult.transfers.map(t => ({
          ...t,
          tokenId: t.tokenId ?? undefined,
          erc721TokenId: t.erc721TokenId ?? undefined,
          erc1155Metadata: t.erc1155Metadata ?? undefined,
        })),
      )

      buffer.incomingPageKey = incomingResult.pageKey
      buffer.outgoingPageKey = outgoingResult.pageKey
      buffer.hasReachedEnd.incoming = incomingResult.pageKey === undefined
      buffer.hasReachedEnd.outgoing = outgoingResult.pageKey === undefined
    }

    const allTransfers = [...buffer.incoming, ...buffer.outgoing]
    const transfersMap = new Map<string, AssetTransfer>()
    for (const transfer of allTransfers) {
      transfersMap.set(transfer.uniqueId, transfer)
    }

    const uniqueTransfers = Array.from(transfersMap.values())

    uniqueTransfers.sort((a, b) => {
      const blockDiff = parseInt(b.blockNum, 16) - parseInt(a.blockNum, 16)
      if (blockDiff !== 0) return blockDiff

      const timestampA = new Date(a.metadata.blockTimestamp).getTime()
      const timestampB = new Date(b.metadata.blockTimestamp).getTime()
      return timestampB - timestampA
    })

    const transfers = uniqueTransfers.slice(0, limit)

    const consumedIds = new Set(transfers.map(t => t.uniqueId))
    buffer.incoming = buffer.incoming.filter(t => !consumedIds.has(t.uniqueId))
    buffer.outgoing = buffer.outgoing.filter(t => !consumedIds.has(t.uniqueId))

    const hasMoreTransfers =
      !buffer.hasReachedEnd.incoming ||
      !buffer.hasReachedEnd.outgoing ||
      buffer.incoming.length > 0 ||
      buffer.outgoing.length > 0

    let nextPageKey: string | undefined
    if (hasMoreTransfers) {
      nextPageKey = JSON.stringify({
        incoming: buffer.incomingPageKey,
        outgoing: buffer.outgoingPageKey,
      })
    }

    return {
      transfers,
      pageKey: nextPageKey,
    }
  } catch (error) {
    console.error('getAssetTransfers error:', error)
    return {
      transfers: [],
      pageKey: undefined,
    }
  }
}

export async function getTransactionStatus(
  txHash: string,
  network: NetworkType,
): Promise<'pending' | 'success' | 'failed' | 'unknown'> {
  const url = `https://${alchemyNetworks[network]}.g.alchemy.com/v2/${serverEnv.ALCHEMY_API_KEY}`

  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      jsonrpc: '2.0',
      method: 'eth_getTransactionReceipt',
      params: [txHash],
      id: 1,
    }),
  })

  const data = await res.json()

  if (data?.result == null) return 'pending'
  if (data?.result?.status === '0x1') return 'success'
  if (data?.result?.status === '0x0') return 'failed'

  return 'unknown'
}

/**
 * note: only available on Ethereum (Seaport, Wyvern, X2Y2, Blur, LooksRare, Cryptopunks), Polygon (Seaport) & Optimism (Seaport) mainnets
 *
 * important: We plan to release a new API that integrates NFT sales before turning off this endpoint (eta December 2024), so we'll keep you posted and let you know when that is scheduled!
 *
 * @see https://docs.alchemy.com/reference/getnftsales-v3
 *
 * 180 CU per request https://docs.alchemy.com/reference/compute-unit-costs#nft-api
 * 10 Throughput CU per second
 */
export async function deprecated_getNFTSale(
  address: string,
  contract: string,
  tokenId: string,
  network: NetworkType,
) {
  const url = new URL(
    `https://${alchemyNetworks[network]}.g.alchemy.com/nft/v3/${serverEnv.ALCHEMY_API_KEY}/getNFTSales`,
  )
  url.searchParams.set('contractAddress', contract)
  url.searchParams.set('tokenId', tokenId)
  url.searchParams.set('buyerAddress', address)
  url.searchParams.set('order', 'desc')
  url.searchParams.set('taker', 'BUYER')

  const body = await _retry(async () =>
    _fetch<deprecated_NFTSaleResponseBody>(url, 'GET', 3600),
  )

  return body
}

/**
 * note: only available on Ethereum mainnet for Opensea & Looksrare marketplaces.
 *
 * @see https://docs.alchemy.com/reference/getfloorprice-v3
 *
 * 100 CU per request https://docs.alchemy.com/reference/compute-unit-costs#nft-api
 * 10 Throughput CU per second
 */
export async function getNFTFloorPrice(contract: string, network: NetworkType) {
  const url = new URL(
    `https://${alchemyNetworks[network]}.g.alchemy.com/nft/v3/${serverEnv.ALCHEMY_API_KEY}/getFloorPrice`,
  )
  url.searchParams.set('contractAddress', contract)

  const body = await _retry(async () =>
    _fetch<NFTFloorPriceResponseBody>(url, 'GET', 15),
  )

  return body
}

export async function getFeeRate(
  network: NetworkType = 'ethereum',
  params: {
    from: string
    to: string
    value: string
  },
) {
  const url = new URL(
    `https://${alchemyNetworks[network]}.g.alchemy.com/v2/${serverEnv.ALCHEMY_API_KEY}`,
  )

  let gasEstimate, maxPriorityFee, latestBlock, feeHistory, ethPriceData

  try {
    ;[gasEstimate, maxPriorityFee, latestBlock, feeHistory, ethPriceData] =
      await Promise.all([
        _fetch<GasEstimateResponseBody>(url, 'POST', 3600, {
          jsonrpc: '2.0',
          id: 1,
          method: 'eth_estimateGas',
          params: [params],
        }),
        _fetch<MaxPriorityFeeResponseBody>(url, 'POST', 3600, {
          jsonrpc: '2.0',
          id: 2,
          method: 'eth_maxPriorityFeePerGas',
          params: [],
        }),
        _fetch<BlockResponseBody>(url, 'POST', 3600, {
          jsonrpc: '2.0',
          id: 3,
          method: 'eth_getBlockByNumber',
          params: ['latest', false],
        }),
        _fetch<FeeHistoryResponseBody>(url, 'POST', 3600, {
          jsonrpc: '2.0',
          id: 4,
          method: 'eth_feeHistory',
          params: ['0x4', 'latest', [10, 50, 90]],
        }),
        getNativeTokenPrice('ethereum'),
      ])
  } catch (error) {
    console.error('Failed to fetch fee rate:', error)
    throw new Error('Failed to fetch fee rate.', { cause: error })
  }

  const baseFeeHex = latestBlock?.result?.baseFeePerGas
  const priorityFeeHex = maxPriorityFee?.result
  const gasLimitHex = gasEstimate?.result

  if (!baseFeeHex || !priorityFeeHex || !gasLimitHex) {
    throw new Error('Missing baseFee or gas limit or priorityFee')
  }

  const baseFee = BigInt(baseFeeHex)
  const priorityFee = BigInt(priorityFeeHex)
  const gasLimit = BigInt(gasLimitHex)
  const maxFeePerGas = baseFee * 2n + priorityFee

  const feeHistoryData = processFeeHistory({
    ...feeHistory?.result,
    gasUsedRatio: feeHistory?.result?.gasUsedRatio?.map(String) ?? [],
    reward: feeHistory?.result?.reward ?? null,
  })

  const ethPrice =
    typeof ethPriceData?.eur === 'number'
      ? ethPriceData.eur
      : parseFloat(ethPriceData?.eur) || 0

  const feeEth = parseFloat(formatEther(gasLimit * (baseFee + priorityFee)))
  const feeEur = ethPrice > 0 ? feeEth * ethPrice : 0
  const confirmationTime = estimateConfirmationTime(priorityFee, feeHistoryData)

  return {
    maxFeeEur: parseFloat(feeEur.toFixed(6)),
    feeEth,
    confirmationTime,
    txParams: {
      gasLimit: gasLimitHex,
      maxFeePerGas: `0x${maxFeePerGas.toString(16)}`,
      maxPriorityFeePerGas: priorityFeeHex,
    },
  }
}

/**
 * @see https://docs.alchemy.com/reference/eth-sendrawtransaction
 */
export async function broadcastTransaction(
  txHex: string,
  network: NetworkType = 'ethereum',
) {
  const url = new URL(
    `https://${alchemyNetworks[network]}.g.alchemy.com/v2/${serverEnv.ALCHEMY_API_KEY}`,
  )

  const body = await _retry(async () =>
    _fetch<SendRawTransactionResponseBody>(url, 'POST', 0, {
      jsonrpc: '2.0',
      id: 1,
      method: 'eth_sendRawTransaction',
      params: [txHex],
    }),
  )

  return body
}

/**
 * @see https://www.alchemy.com/docs/node/ethereum/ethereum-api-endpoints/eth-get-transaction-count
 */
export async function getTransactionCount(
  address: string,
  network: NetworkType,
) {
  const url = new URL(
    `https://${alchemyNetworks[network]}.g.alchemy.com/v2/${serverEnv.ALCHEMY_API_KEY}`,
  )

  const body = await _retry(async () =>
    _fetch<TransactionCountResponseBody>(url, 'POST', 0, {
      jsonrpc: '2.0',
      id: 1,
      method: 'eth_getTransactionCount',
      params: [address, 'latest'],
    }),
  )

  const nonce = body.result

  return nonce
}

async function _fetch<T extends ResponseBody>(
  url: URL,
  method: 'GET' | 'POST',
  revalidate: number,
  body?: Record<string, unknown>,
): Promise<T> {
  const response = await fetch(url, {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
    ...(body && { body: JSON.stringify(body) }),
    // why: https://nextjs.org/docs/app/building-your-application/data-fetching/fetching#reusing-data-across-multiple-functions
    // why: https://github.com/vercel/next.js/issues/70946
    cache: 'no-store', //  no caching
    next: {
      revalidate,
    },
  })

  if (!response.ok) {
    console.error(response.statusText)
    throw new Error('Failed to fetch.', { cause: response.status })
  }

  const _body: T = await response.json()

  return _body
}

/**
 * Source https://docs.alchemy.com/docs/how-to-implement-retries#option-2-exponential-backoff
 *
 * Motivation:
 * > In most instances, hitting your throughput limit will not affect your user's experience engaging with your application. As long as retries are implemented, the requests will go through in the following second. As a general rule of thumb, if you are experiencing under 30% rate limited requests, using retries is the best solution.
 * > – https://docs.alchemy.com/reference/throughput#option-2-retry-after
 */
async function _retry<T extends ResponseBody>(
  fetchFn: () => ReturnType<typeof _fetch<T>>,
) {
  const result = await retry(
    async bail => {
      try {
        const result = await fetchFn()

        return result
      } catch (error) {
        // `Your app has exceeded its compute units per second capacity.` https://docs.alchemy.com/reference/error-reference#http-status-codes
        if (error instanceof Error && error.cause === 429) {
          throw error
        }

        return bail(error)
      }
    },
    {
      retries: 3,
      factor: 2,
      minTimeout: 1000,
      maxTimeout: 60000,
      randomize: true,
    },
  )

  if (!result) {
    throw new Error('Aborted to fetch.')
  }

  return result
}
