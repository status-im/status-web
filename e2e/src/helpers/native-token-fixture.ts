import { loadEnvConfig } from '@config/env.js'

/**
 * The tRPC `json` payload the wallet's token-detail page + send modal read for
 * native ETH (assets.nativeToken). The send modal validates against
 * `summary.total_balance`, so this must carry the funded balance.
 */
interface NativeTokenData {
  summary: { total_balance: number; total_eur: number; [k: string]: unknown }
  assets?: {
    ethereum?: {
      balance: number
      total_eur: number
      price_eur: number
      [k: string]: unknown
    }
  }
}

/**
 * A self-contained, schema-complete assets.nativeToken body with a given balance.
 * Used as the deterministic fallback so the wallet tests don't hard-depend on
 * apps/api's CoinGecko-backed metadata (e.g. in CI with dummy keys).
 */
export function synthesizeNativeTokenBody(
  ethBalance: number,
  priceEur = 2_000,
): NativeTokenData {
  const totalEur = ethBalance * priceEur
  const metadata = {
    market_cap: 0,
    volume_24: 0,
    rank_by_market_cap: 2,
    fully_diluted: 0,
    circulation: 0,
    total_supply: 0,
    all_time_high: 0,
    all_time_low: 0,
    about: 'Ethereum',
  }
  return {
    summary: {
      total_balance: ethBalance,
      total_eur: totalEur,
      total_eur_24h_change: 0,
      total_percentage_24h_change: 0,
      icon: '',
      name: 'Ether',
      symbol: 'ETH',
      about: 'Ethereum',
      contracts: {},
    },
    assets: {
      ethereum: {
        networks: ['ethereum'],
        native: true,
        contract: null,
        icon: '',
        name: 'Ether',
        symbol: 'ETH',
        price_eur: priceEur,
        price_percentage_24h_change: 0,
        balance: ethBalance,
        total_eur: totalEur,
        decimals: 18,
        metadata,
      },
    },
  }
}

/**
 * Get the assets.nativeToken TokenData shape with the balance/fiat fields set to
 * a deterministic value. Prefers the real apps/api body (accurate price/metadata)
 * and patches its balance; falls back to a synthesized body when apps/api or its
 * CoinGecko dependency is unavailable (e.g. CI with dummy keys).
 *
 * Why patch the balance: the send modal reads `summary.total_balance`, but
 * apps/api marks nativeToken cacheable (+ an eRPC 60s cache), so the live read
 * can lag the funded fork balance. Serving a patched body from the data seam
 * removes that timing dependency.
 */
export async function captureNativeTokenBody(
  address: string,
  ethBalance: number,
): Promise<unknown> {
  const env = loadEnvConfig()

  try {
    const url = new URL(
      `${env.WALLET_STATUS_API_URL}/api/trpc/assets.nativeToken`,
    )
    url.searchParams.set(
      'input',
      JSON.stringify({
        json: { address, networks: ['ethereum'], symbol: 'ETH' },
      }),
    )

    const res = await fetch(url, { headers: { 'cache-control': 'no-store' } })
    if (!res.ok) throw new Error(`apps/api returned ${res.status}`)

    const body = (await res.json()) as {
      result: { data: { json: NativeTokenData } }
    }
    const data = body.result.data.json
    if (!data?.summary) throw new Error('unexpected nativeToken shape')

    const priceEur = data.assets?.ethereum?.price_eur ?? 2_000
    const totalEur = ethBalance * priceEur
    data.summary.total_balance = ethBalance
    data.summary.total_eur = totalEur
    if (data.assets?.ethereum) {
      data.assets.ethereum.balance = ethBalance
      data.assets.ethereum.total_eur = totalEur
    }
    return data
  } catch {
    return synthesizeNativeTokenBody(ethBalance)
  }
}
