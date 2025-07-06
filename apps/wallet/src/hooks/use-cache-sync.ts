import { useEffect } from 'react'

import { useQueryClient } from '@tanstack/react-query'

import type { ApiOutput } from '@status-im/wallet/data'
import type { QueryClient } from '@tanstack/react-query'

export const SYNC_DELAY_MS = 50

type AssetData = ApiOutput['assets']['all']['assets'][number]

type CacheSyncTokenData = {
  summary: {
    total_balance?: number
    total_eur?: number
  }
  assets?: Record<string, AssetData>
}

function getQueryData<T>(
  queryClient: QueryClient,
  queryKey: unknown[],
): T | undefined {
  try {
    return queryClient.getQueryData<T>(queryKey)
  } catch (error) {
    console.warn('Failed to get query data:', { queryKey, error })
    return undefined
  }
}

function handleSyncError(
  operation: string,
  context: Record<string, unknown>,
  error: unknown,
): void {
  console.warn(`Failed to ${operation}:`, { ...context, error })
}

function findAssetByTicker(
  assets: AssetData[],
  ticker: string,
): AssetData | undefined {
  return assets.find(asset => {
    if (ticker.startsWith('0x')) {
      return asset.contract?.toLowerCase() === ticker.toLowerCase()
    } else {
      return asset.symbol?.toLowerCase() === ticker.toLowerCase()
    }
  })
}

function getTokenKey(asset: AssetData): string | null {
  if (asset.contract) {
    return asset.contract
  }
  if (asset.symbol) {
    return asset.symbol
  }
  return null
}

export function useCacheSync(address: string) {
  const queryClient = useQueryClient()

  useEffect(() => {
    const syncInProgress = new Set<string>()

    const updateTokenData = (
      asset: AssetData,
      tokenData: CacheSyncTokenData,
    ) => ({
      ...tokenData,
      summary: {
        ...tokenData.summary,
        total_balance: asset.balance ?? tokenData.summary.total_balance,
        total_eur: asset.total_eur ?? tokenData.summary.total_eur,
      },
      assets: tokenData.assets
        ? updateAssetObject(tokenData.assets, asset)
        : undefined,
    })

    const updateAssetObject = (
      assets: Record<string, AssetData>,
      asset: AssetData,
    ) => {
      for (const [key, existing] of Object.entries(assets)) {
        if (
          existing?.symbol === asset.symbol ||
          existing?.contract === asset.contract
        ) {
          return {
            ...assets,
            [key]: {
              ...existing,
              balance: asset.balance ?? existing.balance,
              total_eur: asset.total_eur ?? existing.total_eur,
              price_eur: asset.price_eur ?? existing.price_eur,
              price_percentage_24h_change:
                asset.price_percentage_24h_change ??
                existing.price_percentage_24h_change,
            },
          }
        }
      }
      return assets
    }

    const syncAssetToToken = (asset: AssetData) => {
      if (!asset?.symbol) return

      const ticker = getTokenKey(asset)
      if (!ticker || syncInProgress.has(ticker)) return

      try {
        const tokenData = getQueryData<CacheSyncTokenData>(queryClient, [
          'token',
          ticker,
        ])
        if (!tokenData?.summary) return

        queryClient.setQueryData(
          ['token', ticker],
          updateTokenData(asset, tokenData),
        )
      } catch (error) {
        handleSyncError('sync asset to token', { ticker }, error)
      }
    }

    const syncTokenToAsset = (
      ticker: string,
      tokenData: CacheSyncTokenData,
    ) => {
      if (syncInProgress.has(ticker)) return
      syncInProgress.add(ticker)

      try {
        const assets = getQueryData<AssetData[]>(queryClient, [
          'assets',
          address,
        ])

        if (!Array.isArray(assets)) return

        const assetIndex = assets.findIndex(asset => {
          const isContract = ticker.startsWith('0x')
          return isContract
            ? asset.contract?.toLowerCase() === ticker.toLowerCase()
            : asset.symbol?.toLowerCase() === ticker.toLowerCase()
        })

        if (assetIndex === -1) return

        const firstAsset = Object.values(tokenData.assets || {})[0]
        if (!firstAsset) return

        const updatedAsset = {
          ...assets[assetIndex],
          balance:
            tokenData.summary.total_balance ?? assets[assetIndex].balance,
          total_eur:
            tokenData.summary.total_eur ?? assets[assetIndex].total_eur,
          price_eur: firstAsset.price_eur ?? assets[assetIndex].price_eur,
          price_percentage_24h_change:
            firstAsset.price_percentage_24h_change ??
            assets[assetIndex].price_percentage_24h_change,
        }

        const updatedAssets = [...assets]
        updatedAssets[assetIndex] = updatedAsset

        queryClient.setQueryData(['assets', address], updatedAssets)
        queryClient.invalidateQueries({
          queryKey: ['assets', address],
          exact: true,
          refetchType: 'none',
        })
      } catch (error) {
        handleSyncError('sync token to asset', { ticker }, error)
      } finally {
        syncInProgress.delete(ticker)
      }
    }

    try {
      const existingAssets = getQueryData<AssetData[]>(queryClient, [
        'assets',
        address,
      ])
      if (Array.isArray(existingAssets)) {
        existingAssets.forEach(syncAssetToToken)
      }
    } catch (error) {
      handleSyncError('sync existing assets on mount', { address }, error)
    }

    const unsubscribe = queryClient.getQueryCache().subscribe(event => {
      try {
        if (
          event.type === 'updated' &&
          event.query.queryKey[0] === 'assets' &&
          event.query.queryKey[1] === address &&
          event.action.type === 'success'
        ) {
          const assets = event.action.data as AssetData[]
          if (Array.isArray(assets)) {
            assets.forEach(syncAssetToToken)
          }
        }

        if (
          event.type === 'added' &&
          event.query.queryKey[0] === 'token' &&
          event.query.queryKey.length === 2
        ) {
          const ticker = event.query.queryKey[1] as string
          const assets = getQueryData<AssetData[]>(queryClient, [
            'assets',
            address,
          ])

          if (Array.isArray(assets)) {
            const matchingAsset = findAssetByTicker(assets, ticker)
            if (matchingAsset) {
              setTimeout(() => syncAssetToToken(matchingAsset), SYNC_DELAY_MS)
            }
          }
        }

        if (
          event.type === 'updated' &&
          event.query.queryKey[0] === 'token' &&
          event.query.queryKey.length === 2 &&
          event.action.type === 'success'
        ) {
          const ticker = event.query.queryKey[1] as string
          const tokenData = event.action.data as CacheSyncTokenData

          if (tokenData?.summary && tokenData?.assets) {
            setTimeout(() => syncTokenToAsset(ticker, tokenData), SYNC_DELAY_MS)
          }
        }
      } catch (error) {
        handleSyncError('cache sync event handler', { address }, error)
      }
    })

    return () => {
      unsubscribe()
      syncInProgress.clear()
    }
  }, [address, queryClient])
}
