import { cache } from 'react'

import { z } from 'zod'

import {
  // getNFTFloorPrice,
  getNFTMetadata,
  getNFTs,
} from '../../services/alchemy'
import {
  COINGECKO_REVALIDATION_TIMES,
  fetchTokensPrice,
} from '../../services/coingecko/index'
import { publicProcedure, router } from '../lib/trpc'

import type {
  NFTMetadataResponseBody,
  NFTsResponseBody,
} from '../../services/alchemy/types'
import type { NetworkType } from '../types'

export type Collectible = {
  contract: string
  isSpam: boolean | null
  spamClassifications?: string[]
  id: string
  displayId: string
  name: string
  displayName: string
  image?: string
  thumbnail?: string
  collection: {
    name?: string
    image?: string
    size?: number
  }
  openSea?: {
    collectionSlug?: string
    safelistRequestStatus?: string
    isVerified?: boolean
  }
  links: {
    opensea: string
  }
  about?: string
  network: NetworkType
  standard: string
  traits?: Record<string, string | number | boolean>
  floor_price?: number
  currency?: string
  price_eur?: number
}

export const collectiblesRouter = router({
  page: publicProcedure
    .input(
      z.object({
        address: z.string(),
        networks: z.array(z.enum(['ethereum'])),
        pages: z.record(z.string(), z.string()).optional(),
        limit: z.number().optional(),
        offset: z.number().optional(),
        search: z.string().optional(),
        sort: z
          .object({
            column: z.enum(['name', 'collection']),
            direction: z.enum(['asc', 'desc']),
          })
          .optional(),
      }),
    )
    .query(async ({ input }) => {
      const inputHash = JSON.stringify(input)
      return await cachedPage(inputHash)
    }),
  collectible: publicProcedure
    .input(
      z.object({
        contract: z.string(),
        tokenId: z.string(),
        network: z.enum(['ethereum']),
      }),
    )
    .query(async ({ input }) => {
      const inputHash = JSON.stringify(input)

      return await cachedCollectible(inputHash)
    }),
})

const cachedPage = cache(async (key: string) => {
  const { address, networks, pages, limit, offset, search, sort } =
    JSON.parse(key)

  return await page({ address, networks, pages, limit, offset, search, sort })
})

async function page({
  address,
  networks,
  pages,
  limit = 20,
  offset = 0,
  search,
  sort,
}: {
  address: string
  networks: NetworkType[]
  pages?: Partial<Record<NetworkType, string>>
  limit?: number
  offset?: number
  search?: string
  sort?: { column: 'name' | 'collection'; direction: 'asc' | 'desc' }
}) {
  // hardcoded address for testing. Should remove before merging
  // address = '0xb5be918f7412ab7358064e0cfca78c03e53645bf'

  // Full scan is required only for non-default sort (global ordering).
  const shouldScanAll =
    !!sort && (sort.column !== 'name' || sort.direction !== 'asc')

  // Primary filter: only exclude explicit spam
  const passesFilters = (collectible: Collectible) => {
    return !collectible.isSpam
  }

  // Fallback 1: allow unverified collections, still exclude spam classifications
  const passesRelaxedFilters = (collectible: Collectible) => {
    const hasSpamClassifications =
      (collectible.spamClassifications?.length ?? 0) > 0

    return !collectible.isSpam && !hasSpamClassifications
  }

  // Fallback 2: only exclude explicit spam
  const passesBareFilters = (collectible: Collectible) => {
    return collectible.isSpam !== true
  }

  // Text match against name or collection
  const applySearch = (items: Collectible[]) => {
    if (!search) return items
    const searchLower = search.toLowerCase()

    return items.filter(
      collectible =>
        collectible.name?.toLowerCase().includes(searchLower) ||
        collectible.collection.name?.toLowerCase().includes(searchLower),
    )
  }

  const matchesSearch = (collectible: Collectible) => {
    if (!search) return true
    const searchLower = search.toLowerCase()
    return (
      collectible.name?.toLowerCase().includes(searchLower) ||
      collectible.collection.name?.toLowerCase().includes(searchLower)
    )
  }

  // Sorting is applied after filtering
  const applySort = (items: Collectible[]) => {
    if (!sort) return items

    const sorted = [...items]

    sorted.sort((a, b) => {
      const comparison =
        sort.column === 'name'
          ? (a.name || '').localeCompare(b.name || '')
          : (a.collection.name || '').localeCompare(b.collection.name || '') ||
            (a.name || '').localeCompare(b.name || '')

      return sort.direction === 'asc' ? comparison : -comparison
    })

    return sorted
  }

  // Select the first non-empty filter result, in priority order
  const selectWithFallbacks = (
    items: Collectible[],
    ...predicates: Array<(collectible: Collectible) => boolean>
  ) => {
    for (const predicate of predicates) {
      const filtered = items.filter(predicate)

      if (filtered.length > 0) return filtered
    }

    return []
  }

  // Full scan path: fetch all pages, then filter/search/sort/paginate in-memory
  if (shouldScanAll) {
    const collectibles: Collectible[] = []

    await Promise.all(
      networks.map(async network => {
        let pageKey: string | undefined = pages?.[network]

        do {
          const response = await getNFTs(address, network, pageKey)

          for (const nft of response.ownedNfts) {
            collectibles.push(map(nft, network))
          }

          pageKey = response.pageKey ?? undefined
        } while (pageKey)
      }),
    )

    const filteredCollectibles = applySort(
      applySearch(
        selectWithFallbacks(
          collectibles,
          passesFilters,
          passesRelaxedFilters,
          passesBareFilters,
        ),
      ),
    )

    const paginatedCollectibles = filteredCollectibles.slice(
      offset,
      offset + limit,
    )

    return {
      collectibles: paginatedCollectibles,
      hasMore: filteredCollectibles.length > offset + limit,
    }
  }

  // Page-key path: fetch until we fill the page, preserving fallbacks locally
  const paginatedCollectibles: Collectible[] = []
  const fallbackCollectibles: Collectible[] = []
  const bareCollectibles: Collectible[] = []
  const rawCollectibles: Collectible[] = []
  const nextPages: Partial<Record<NetworkType, string>> = {}
  const pageSize = Math.min(100, Math.max(1, limit))

  const processCollectible = (collectible: Collectible) => {
    if (!matchesSearch(collectible)) return false

    if (rawCollectibles.length < limit) {
      rawCollectibles.push(collectible)
    }

    if (passesFilters(collectible)) {
      paginatedCollectibles.push(collectible)
      return paginatedCollectibles.length >= limit
    }

    if (passesRelaxedFilters(collectible)) {
      fallbackCollectibles.push(collectible)
      return false
    }

    if (passesBareFilters(collectible)) {
      bareCollectibles.push(collectible)
    }

    return false
  }

  for (const network of networks) {
    let pageKey: string | undefined = pages?.[network]

    while (paginatedCollectibles.length < limit) {
      const response = await getNFTs(
        address,
        network,
        pageKey,
        String(pageSize),
      )

      for (const nft of response.ownedNfts) {
        const shouldStop = processCollectible(map(nft, network))
        if (shouldStop) {
          break
        }
      }

      pageKey = response.pageKey ?? undefined

      const hasVerified = paginatedCollectibles.length > 0
      const hasRelaxed = fallbackCollectibles.length >= limit
      const hasBare = bareCollectibles.length >= limit

      if (
        !pageKey ||
        paginatedCollectibles.length >= limit ||
        (!hasVerified && (hasRelaxed || hasBare))
      ) {
        break
      }
    }

    if (pageKey) {
      nextPages[network] = pageKey
    }

    if (paginatedCollectibles.length >= limit) {
      break
    }
  }

  let finalCollectibles = paginatedCollectibles

  if (finalCollectibles.length === 0) {
    if (fallbackCollectibles.length > 0) {
      finalCollectibles = fallbackCollectibles.slice(0, limit)
    } else if (bareCollectibles.length > 0) {
      finalCollectibles = bareCollectibles.slice(0, limit)
    } else if (rawCollectibles.length > 0) {
      finalCollectibles = rawCollectibles.slice(0, limit)
    }
  }

  finalCollectibles = applySort(applySearch(finalCollectibles))

  return {
    collectibles: finalCollectibles,
    hasMore: Object.keys(nextPages).length > 0,
    pages: Object.keys(nextPages).length > 0 ? nextPages : undefined,
  }
}

const cachedCollectible = cache(async (key: string) => {
  const { contract, tokenId, network } = JSON.parse(key)

  return await collectible(contract, tokenId, network)
})

async function collectible(
  contract: string,
  tokenId: string,
  network: NetworkType,
) {
  const nft = await getNFTMetadata(contract, tokenId, network)

  // todo: replace floor price provider https://github.com/status-im/status-website/issues/1547
  const currency = 'USD'

  let price: number | undefined
  let floorPrice: number | undefined

  if (network === 'ethereum') {
    const symbol = 'ETH'
    const priceData = await fetchTokensPrice(
      [symbol],
      COINGECKO_REVALIDATION_TIMES.CURRENT_PRICE,
    )
    price = priceData[symbol]?.usd
    floorPrice = nft.contract.openSeaMetadata.floorPrice ?? undefined
    // note: looksRare data is significantly inconsistent with opensea data
    // floorPrice = (await getNFTFloorPrice(contract, network)).openSea.floorPrice
  }

  return map(nft, network, currency, price, floorPrice)
}

function truncateId(id: string): string {
  const MAX_DISPLAY_ID_LENGTH = 6

  return id.length > MAX_DISPLAY_ID_LENGTH
    ? `${id.slice(0, MAX_DISPLAY_ID_LENGTH)}...`
    : id
}

/** Resolve a readable name from nft.name and contract.name, stripping redundant token IDs. */
function resolveName(
  nftName: string | null,
  contractName: string | null,
  tokenId: string,
): string {
  const trimmed = (nftName || '').trim()
  const isIdOnly = /^#\d+$/.test(trimmed)
  const raw = isIdOnly ? contractName || '' : trimmed || contractName || ''

  return raw.replace(new RegExp(`\\s*#${tokenId}$`), '').trim()
}

function formatDisplayName(name: string, displayId: string): string {
  if (!name) return `#${displayId}`
  if (/#\d+/.test(name)) return name
  return `${name} #${displayId}`
}

function isOpenSeaVerified(status?: string): boolean {
  return status === 'verified' || status === 'approved'
}

function formatOpenSeaTokenId(tokenId: string): string {
  if (tokenId.startsWith('0x')) {
    try {
      return BigInt(tokenId).toString(10)
    } catch {
      return tokenId
    }
  }

  return tokenId
}

function map(
  nft: NFTsResponseBody['ownedNfts'][number] | NFTMetadataResponseBody,
  network: NetworkType,
  currency?: string,
  price?: number,
  floorPrice?: number,
) {
  const name = resolveName(nft.name, nft.contract.name, nft.tokenId)
  const displayId = truncateId(nft.tokenId)
  const safelistRequestStatus =
    nft.contract.openSeaMetadata?.safelistRequestStatus ?? undefined
  const spamClassifications = nft.contract.spamClassifications ?? []

  const attributes = nft.raw?.metadata?.attributes

  const collectible: Collectible = {
    id: nft.tokenId,
    displayId,
    contract: nft.contract.address,
    isSpam: nft.contract.isSpam,
    spamClassifications,
    name,
    displayName: formatDisplayName(name, displayId),
    image: nft.image.originalUrl ?? undefined,
    thumbnail: nft.image.thumbnailUrl ?? undefined,
    collection: {
      name: nft.collection?.name ?? undefined,
      image: nft.collection?.bannerImageUrl ?? undefined,
      size: nft.contract.totalSupply
        ? parseInt(nft.contract.totalSupply)
        : undefined,
    },
    openSea: {
      collectionSlug: nft.contract.openSeaMetadata?.collectionSlug ?? undefined,
      safelistRequestStatus,
      isVerified: isOpenSeaVerified(safelistRequestStatus),
    },
    links: {
      opensea: `https://opensea.io/item/${network}/${nft.contract.address}/${formatOpenSeaTokenId(
        nft.tokenId,
      )}`,
    },
    about: nft.description ?? undefined,
    network: network,
    standard: nft.tokenType,
    traits: Array.isArray(attributes)
      ? attributes.reduce(
          (acc, attribute) => {
            acc[attribute.trait_type] = attribute.value
            return acc
          },
          {} as Record<string, string | number | boolean>,
        )
      : undefined,
    ...(floorPrice &&
      price &&
      currency && {
        floor_price: floorPrice,
        price_eur: floorPrice * price,
        currency,
      }),
  }

  return collectible
}
