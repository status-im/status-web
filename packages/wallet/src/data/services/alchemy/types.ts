export type NativeTokenBalanceResponseBody = {
  jsonrpc: string
  id: number
  result: string
}

export type ERC20TokenBalanceResponseBody = {
  jsonrpc: string
  id: number
  result: {
    tokenBalances: Array<{
      contractAddress: string
      tokenBalance: string
    }>
  }
}
export type TokenBalanceHistoryResponseBody = {
  jsonrpc: string
  id: null
  result: {
    transfers: Array<{
      blockNum: string
      uniqueId: string
      hash: string
      from: string
      to: string
      value: number
      erc721TokenId: null
      erc1155Metadata: null
      tokenId: null
      asset: string
      category: string
      rawContract: {
        value: string
        address: null
        decimal: string
      }
      metadata: {
        blockTimestamp: string
      }
    }>
  }
}

export type NFTsResponseBody = {
  ownedNfts: Array<{
    contract: {
      address: string
      name: string
      symbol: string
      totalSupply: string | null
      tokenType: string
      contractDeployer: string
      deployedBlockNumber: number
      openSeaMetadata: {
        floorPrice: number
        collectionName: string
        collectionSlug: string
        safelistRequestStatus: string
        imageUrl: string
        description: string
        externalUrl: string | null
        twitterUsername: string | null
        discordUrl: string | null
        bannerImageUrl: string | null
        lastIngestedAt: string
      }
      isSpam: boolean | null
      spamClassifications: Array<string>
    }
    tokenId: string
    tokenType: string
    name: string
    description: string | null
    tokenUri: string
    image: {
      cachedUrl: string
      thumbnailUrl: string
      pngUrl: string
      contentType: string
      size: number
      originalUrl: string | null
    }
    raw: {
      tokenUri: string
      metadata: {
        image: string
        external_url: string
        is_normalized: boolean
        image_url: string
        name: string
        description: string
        attributes?: Array<{
          value: string | number | boolean
          trait_type: string
          display_type?: string
        }>
        version: number
        url: string
      }
      error: null | string
    }
    collection?: {
      name: string
      slug: string
      externalUrl: string | null
      bannerImageUrl: string | null
    }
    mint: {
      mintAddress: string | null
      blockNumber: number | null
      timestamp: string | null
      transactionHash: string | null
    }
    owners: null | Array<unknown>
    timeLastUpdated: string
    balance: string
    acquiredAt: {
      blockTimestamp: string | null
      blockNumber: number | null
    }
  }>
  totalCount: number
  validAt: {
    blockNumber: number
    blockHash: string
    blockTimestamp: string
  }
  pageKey: string
}

export type NFTMetadataResponseBody = {
  contract: {
    address: string
    name: string
    symbol: string
    totalSupply: string
    tokenType: string
    contractDeployer: string
    deployedBlockNumber: number
    openSeaMetadata: {
      floorPrice: number | null
      collectionName: string
      collectionSlug: string
      safelistRequestStatus: string
      imageUrl: string
      description: string
      externalUrl: string | null
      twitterUsername: string
      discordUrl: string
      bannerImageUrl: string
      lastIngestedAt: string
    }
    isSpam: boolean | null
    spamClassifications: string[]
  }
  tokenId: string
  tokenType: string
  name: string
  description: string | null
  tokenUri: string
  image: {
    cachedUrl: string
    thumbnailUrl: string
    pngUrl: string
    contentType: string
    size: number
    originalUrl: string | null
  }
  raw: {
    tokenUri: string
    metadata: {
      name: string
      image: string
      attributes: Array<{
        value: string
        trait_type: string
      }>
    }
    error: string | null
  }
  collection: {
    name: string
    slug: string
    externalUrl: string | null
    bannerImageUrl: string
  }
  mint: {
    mintAddress: string | null
    blockNumber: number | null
    timestamp: string | null
    transactionHash: string | null
  }
  owners: unknown | null
  timeLastUpdated: string
}

export type deprecated_NFTSaleResponseBody = {
  nftSales: Array<{
    marketplace: string
    marketplaceAddress: string
    contractAddress: string
    tokenId: string
    quantity: string
    buyerAddress: string
    sellerAddress: string
    taker: 'BUYER' | 'SELLER'
    sellerFee: {
      amount: string
      tokenAddress: string
      symbol: string
      decimals: number
    }
    protocolFee: {
      amount: string
      tokenAddress: string
      symbol: string
      decimals: number
    }
    royaltyFee: {
      amount: string
      tokenAddress: string
      symbol: string
      decimals: number
    }
    blockNumber: number
    logIndex: number
    bundleIndex: number
    transactionHash: string
  }>
  validAt: {
    blockNumber: number
    blockHash: string
    blockTimestamp: string
  }
  pageKey: string | null
}

export type NFTFloorPriceResponseBody = {
  [key in 'openSea' | 'looksRare']: {
    floorPrice: number
    priceCurrency: string
    collectionUrl: string
    retrievedAt: string
    error: null
  }
}

export type AssetTransfer = {
  blockNum: string
  category: string
  from: string
  to: string
  value: number
  hash: string
  asset: string
  tokenId?: string
  uniqueId: string
  erc1155Metadata?: { tokenId: string; value: string }[]
  erc721TokenId?: string
  metadata: {
    blockTimestamp: string
  }
  rawContract: {
    value: string
    address: string | null
    decimal: string
  }
}

export type AssetTransfersResponseBody = {
  jsonrpc: '2.0'
  id: number
  result: {
    transfers: AssetTransfer[]
  }
}

export type ResponseBody =
  | ERC20TokenBalanceResponseBody
  | NativeTokenBalanceResponseBody
  | NFTsResponseBody
  | NFTMetadataResponseBody
  | deprecated_NFTSaleResponseBody
  | NFTFloorPriceResponseBody
  | TokenBalanceHistoryResponseBody
  | AssetTransfersResponseBody
