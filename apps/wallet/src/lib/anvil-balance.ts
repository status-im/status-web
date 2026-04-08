import type { ApiOutput } from '@status-im/wallet/data'

const ANVIL_RPC_URL = 'http://127.0.0.1:8545'
const ETH_DECIMALS = 1e18

type AssetsResponse = ApiOutput['assets']['all']
type NativeTokenResponse = ApiOutput['assets']['nativeToken']

export async function fetchAnvilEthBalance(address: string): Promise<number> {
  const response = await fetch(ANVIL_RPC_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      jsonrpc: '2.0',
      id: 1,
      method: 'eth_getBalance',
      params: [address, 'latest'],
    }),
    cache: 'no-store',
  })

  if (!response.ok) {
    throw new Error('Failed to fetch Anvil ETH balance')
  }

  const body = (await response.json()) as { result?: string }
  if (!body.result) {
    throw new Error('Missing Anvil ETH balance')
  }

  return Number(body.result) / ETH_DECIMALS
}

export async function patchAssetsAllWithAnvilBalance(
  data: AssetsResponse,
  address: string,
): Promise<AssetsResponse> {
  const balance = await fetchAnvilEthBalance(address)
  const assets = [...data.assets]
  const ethIndex = assets.findIndex(asset => asset.symbol === 'ETH')

  if (ethIndex === -1 || !assets[ethIndex]) {
    return data
  }

  const ethAsset = assets[ethIndex]
  const unitEur =
    ethAsset.balance > 0
      ? ethAsset.total_eur / ethAsset.balance
      : ethAsset.price_eur
  const updatedEthAsset = {
    ...ethAsset,
    balance,
    total_eur: balance * unitEur,
  }

  assets[ethIndex] = updatedEthAsset

  const summaryTotalEur = assets.reduce(
    (sum, asset) => sum + asset.total_eur,
    0,
  )
  const summaryBalance =
    typeof data.summary?.total_balance === 'number'
      ? data.summary.total_balance - ethAsset.balance + balance
      : balance

  return {
    ...data,
    assets,
    summary: {
      ...data.summary,
      total_balance: summaryBalance,
      total_eur: summaryTotalEur,
    },
  }
}

export async function patchNativeTokenWithAnvilBalance(
  data: NativeTokenResponse,
  address: string,
): Promise<NativeTokenResponse> {
  const balance = await fetchAnvilEthBalance(address)
  const ethereumAsset = data.assets.ethereum
  if (!ethereumAsset) {
    return data
  }
  const unitEur =
    ethereumAsset.balance > 0
      ? ethereumAsset.total_eur / ethereumAsset.balance
      : ethereumAsset.price_eur

  return {
    ...data,
    assets: {
      ...data.assets,
      ethereum: {
        ...ethereumAsset,
        balance,
        total_eur: balance * unitEur,
      },
    },
    summary: {
      ...data.summary,
      total_balance: balance,
      total_eur: balance * unitEur,
    },
  }
}
