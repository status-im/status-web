import { cache } from 'react'

import { z } from 'zod'

import {
  // getNFTFloorPrice,
  getNFTMetadata,
  getNFTs,
} from '../../services/alchemy'
import { legacy_fetchTokensPrice } from '../../services/cryptocompare'
import { publicProcedure, router } from '../lib/trpc'

import type {
  NFTMetadataResponseBody,
  NFTsResponseBody,
} from '../../services/alchemy/types'
import type { NetworkType } from '../types'

export type Collectible = {
  contract: string
  isSpam: boolean | null
  id: string
  name: string
  image?: string
  thumbnail?: string
  collection: {
    name?: string
    image?: string
    size?: number
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
        networks: z.array(
          z.enum([
            'ethereum',
            'optimism',
            'arbitrum',
            'base',
            'polygon',
            'bsc',
          ]),
        ),
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
        network: z.enum([
          'ethereum',
          'optimism',
          'arbitrum',
          'base',
          'polygon',
          'bsc',
        ]),
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
  pages?: Record<NetworkType, string>
  limit?: number
  offset?: number
  search?: string
  sort?: { column: 'name' | 'collection'; direction: 'asc' | 'desc' }
}) {
  const collectibles: Collectible[] = []

  await Promise.all(
    networks.map(async network => {
      const pageKey = pages?.[network]
      const { ownedNfts } = await getNFTs(address, network, pageKey)

      for (const nft of ownedNfts) {
        collectibles.push(map(nft, network))
      }
    }),
  )

  let filteredCollectibles = collectibles.filter(
    collectible => !collectible.isSpam,
  )

  if (search) {
    const searchLower = search.toLowerCase()
    filteredCollectibles = collectibles.filter(
      collectible =>
        collectible.name?.toLowerCase().includes(searchLower) ||
        collectible.collection.name?.toLowerCase().includes(searchLower),
    )
  }

  if (sort) {
    filteredCollectibles.sort((a, b) => {
      const comparison =
        sort.column === 'name'
          ? (a.name || '').localeCompare(b.name || '')
          : (a.collection.name || '').localeCompare(b.collection.name || '') ||
            (a.name || '').localeCompare(b.name || '')

      return sort.direction === 'asc' ? comparison : -comparison
    })
  }

  const paginatedCollectibles = filteredCollectibles.slice(
    offset,
    offset + limit,
  )

  return {
    collectibles: paginatedCollectibles,
    hasMore: filteredCollectibles.length > offset + limit,
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
  const currency = 'EUR'
  let price: number | undefined
  let floorPrice: number | undefined
  if (network === 'ethereum') {
    const symbol = 'ETH'
    price = (await legacy_fetchTokensPrice([symbol]))[symbol][currency].PRICE
    floorPrice = nft.contract.openSeaMetadata.floorPrice ?? undefined
    // note: looksRare data is significantly inconsistent with opensea data
    // floorPrice = (await getNFTFloorPrice(contract, network)).openSea.floorPrice
  }

  return map(nft, network, currency, price, floorPrice)
}

function map(
  nft: NFTsResponseBody['ownedNfts'][number] | NFTMetadataResponseBody,
  network: NetworkType,
  currency?: string,
  price?: number,
  floorPrice?: number,
) {
  const collectible: Collectible = {
    id: nft.tokenId,
    contract: nft.contract.address,
    isSpam: nft.contract.isSpam,
    name: nft.name || `${nft.contract.name} #${nft.tokenId}`,
    image: nft.image.originalUrl ?? undefined,
    thumbnail: nft.image.thumbnailUrl ?? undefined,
    collection: {
      name: nft.collection?.name ?? undefined,
      image: nft.collection?.bannerImageUrl ?? undefined,
      size: nft.contract.totalSupply
        ? parseInt(nft.contract.totalSupply)
        : undefined,
    },
    links: {
      opensea: `https://opensea.io/assets/${network}/${nft.contract.address}/${nft.tokenId}`,
    },
    about: nft.description ?? undefined,
    network: network,
    standard: nft.tokenType,
    traits: Array.isArray(nft.raw.metadata.attributes)
      ? nft.raw.metadata.attributes.reduce(
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
