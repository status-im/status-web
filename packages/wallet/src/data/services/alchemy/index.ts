/**
 * @see https://dashboard.alchemy.com for usage
 * @see https://docs.alchemy.com/reference/api-overview for documentation
 * @see https://www.alchemy.com/pricing for pricing
 * @see https://docs.alchemy.com/reference/compute-unit-costs for Compute Unit costs
 */

// import 'server-only'

import retry from 'async-retry'

import { serverEnv } from '../../../config/env.server.mjs'

import type { NetworkType } from '../../api/types'
import type {
  deprecated_NFTSaleResponseBody,
  ERC20TokenBalanceResponseBody,
  NativeTokenBalanceResponseBody,
  NFTFloorPriceResponseBody,
  NFTMetadataResponseBody,
  NFTsResponseBody,
  ResponseBody,
  TokenBalanceHistoryResponseBody,
} from './types'

const alchemyNetworks = {
  ethereum: 'eth-mainnet',
  optimism: 'opt-mainnet',
  arbitrum: 'arb-mainnet',
  base: 'base-mainnet',
  polygon: 'polygon-mainnet',
  bsc: 'bnb-mainnet',
}

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
    _fetch<NativeTokenBalanceResponseBody>(url, 'POST', 3600, {
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
    _fetch<ERC20TokenBalanceResponseBody>(url, 'POST', 3600, {
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

  const now = Math.floor(Date.now() / (1000 * 3600)) * 3600
  const hoursInPeriod = Number(days) * 24
  const timestamps = Array.from(
    { length: hoursInPeriod },
    (_, i) => now - (hoursInPeriod - i) * 3600,
  )
  timestamps.push(Date.now() / 1000)

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
    while (
      transferIndex < transfers.length &&
      new Date(transfers[transferIndex].metadata.blockTimestamp).getTime() /
        1000 >
        timestamp &&
      currentBalance > 0
    ) {
      const transfer = transfers[transferIndex]
      const amount = Number(transfer.value)

      if (transfer.to.toLowerCase() === address.toLowerCase()) {
        if (currentBalance - amount < 0) {
          break
        }

        currentBalance -= amount
      } else {
        currentBalance += amount
      }

      transferIndex++
    }

    return {
      date: new Date(timestamp * 1000).toISOString(),
      // balance: currentBalance,
      // fixme: naming price until chart supports balance
      price: currentBalance,
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
    _fetch<NFTsResponseBody>(url, 'GET', 3600),
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

/**
 * note: only available on Ethereum (Seaport, Wyvern, X2Y2, Blur, LooksRare, Cryptopunks), Polygon (Seaport) & Optimism (Seaport) mainnets
 *
 * important: We plan to release a new API that integrates NFT sales before turning off this endpoint (eta December 2024), so we’ll keep you posted and let you know when that is scheduled!
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
    _fetch<NFTFloorPriceResponseBody>(url, 'GET', 3600),
  )

  return body
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
    cache: 'force-cache', // memoize
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
