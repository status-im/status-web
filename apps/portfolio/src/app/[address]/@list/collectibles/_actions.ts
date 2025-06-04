'use server'

import { getAPIClient } from '../../../../data/api'

import type { Collectible, NetworkType } from '@status-im/wallet/data'

export type GetCollectiblesProps = {
  address: string
  networks: NetworkType[]
  limit?: number
  offset?: number
  search?: string
  sort?: {
    column: 'name' | 'collection'
    direction: 'asc' | 'desc'
  }
}

export type GetCollectiblesResponse = {
  collectibles: Collectible[]
  hasMore: boolean
}

export async function getCollectibles(
  props: GetCollectiblesProps
): Promise<GetCollectiblesResponse> {
  const { address, networks, limit = 20, offset = 0, search, sort } = props

  const apiClient = await getAPIClient()

  const response = await apiClient.collectibles.page({
    address,
    networks,
    limit,
    offset,
    search,
    sort,
  })

  return {
    collectibles: response.collectibles,
    hasMore: response.hasMore,
  }
}
