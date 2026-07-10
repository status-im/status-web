import type { LifiMock } from './lifi-mock.js'
import type { BrowserContext, Route } from '@playwright/test'

/**
 * Test data seam for the wallet extension E2E suite.
 *
 * The wallet's portfolio asset list and activity list are served by Alchemy
 * *enhanced* APIs (assets.all / activities.page) that Anvil cannot answer, so we
 * intercept those page-context tRPC calls and return fork-derived fixtures. We
 * also intercept li.quest (swap quotes) so swaps are deterministic.
 *
 * IMPORTANT: rpc.proxy and nodes.* are deliberately NOT intercepted — they carry
 * real chain I/O (reads, broadcast, nonce, fee) and must reach the Anvil forks
 * through apps/api -> rpc-router. Only the enhanced/off-chain endpoints are faked.
 */

/** Minimal-but-schema-complete metadata block for an Asset. */
const EMPTY_METADATA = {
  market_cap: 0,
  fully_diluted: 0,
  circulation: 0,
  total_supply: 0,
  all_time_high: 0,
  all_time_low: 0,
  rank_by_market_cap: null,
  about: '',
  volume_24: 0,
}

export interface WalletDataSeamOptions {
  /** Display balance for the native ETH row (should mirror funded fork ETH). */
  ethBalance?: number
  /** EUR price used for ETH fiat columns. */
  ethPriceEur?: number
  /**
   * Static tRPC `json` payload for assets.nativeToken (the full TokenData shape:
   * `{ summary, assets }`). Captured once from apps/api at fixture setup and
   * balance-patched, then served for every nativeToken request. Serving a
   * pre-captured body (instant fulfill) avoids the stale-cache balance AND the
   * render race that a per-request re-fetch caused. If omitted, nativeToken is
   * passed through to apps/api.
   */
  nativeTokenBody?: unknown
  /** Initial activity-list entries (usually empty; push via the controller). */
  activities?: unknown[]
  /**
   * li.quest mock (swap quotes/routes/status — see lifi-mock.ts). Every li.quest
   * request is answered by it; nothing leaks to the live API. Harmless for the
   * send suite (the exchange drawer is never opened, so nothing calls li.quest).
   */
  lifi?: LifiMock
  /** Log tRPC procedures we did NOT mock (helps discover missing fixtures). */
  logUnmocked?: boolean
}

/** tRPC json payload shape for nodes.getFeeRate. */
export interface GasFeesJson {
  feeEth: number
  feeEur: number
  maxFeeEth: number
  maxFeeEur: number
  confirmationTime: string
  txParams: {
    gasLimit: string
    maxFeePerGas: string
    maxPriorityFeePerGas: string
  }
}

/**
 * Build a getFeeRate payload for a given maxFeePerGas (in gwei), for a plain
 * 21000-gas ETH transfer. Used to drive the gas-shifted flow deterministically:
 * the wallet's `checkAndRefreshGasFees` compares the cached quote to a fresh one
 * and throws GasShiftedError on a >=30% jump — controlling the fee here removes
 * the race with the real fork base fee and the 12s refetch interval.
 */
export function gasFeesForMaxFee(maxFeeGwei: number): GasFeesJson {
  const maxFeeWei = BigInt(Math.round(maxFeeGwei * 1e9))
  const gasLimit = 21_000n
  const feeEth = Number(maxFeeWei * gasLimit) / 1e18
  return {
    feeEth,
    feeEur: feeEth * 2_000,
    maxFeeEth: feeEth,
    maxFeeEur: feeEth * 2_000,
    confirmationTime: '~30-60s',
    txParams: {
      gasLimit: `0x${gasLimit.toString(16)}`,
      maxFeePerGas: `0x${maxFeeWei.toString(16)}`,
      maxPriorityFeePerGas: '0x3b9aca00', // 1 gwei
    },
  }
}

export interface WalletDataSeamController {
  /** Replace the ETH display balance (e.g. after an on-chain send). */
  setEthBalance: (balance: number) => void
  /** Replace the activity-list entries (e.g. to assert a confirmed tx). */
  setActivities: (activities: unknown[]) => void
  /**
   * Override nodes.getFeeRate with a fixed payload (or null to pass through to
   * the fork). Set a low fee, then a high one, to deterministically trigger the
   * wallet's gas-shifted confirmation step.
   */
  setFeeRate: (fees: GasFeesJson | null) => void
}

const nativeEthAsset = (balance: number, priceEur: number) => ({
  networks: ['ethereum'],
  icon: '',
  name: 'Ethereum',
  symbol: 'ETH',
  price_eur: priceEur,
  price_percentage_24h_change: 0,
  balance,
  total_eur: balance * priceEur,
  decimals: 18,
  native: true,
  contract: null,
  metadata: EMPTY_METADATA,
})

/** Wrap a value in the tRPC + superjson GET-query response envelope. */
const trpcJson = (data: unknown) => ({ result: { data: { json: data } } })

/** Extract the tRPC procedure name from a `/api/trpc/<proc>` URL. */
const procedureOf = (url: string): string => {
  const m = url.match(/\/api\/trpc\/([^/?]+)/)
  return m ? decodeURIComponent(m[1]) : ''
}

export async function installWalletDataSeam(
  context: BrowserContext,
  options: WalletDataSeamOptions = {},
): Promise<WalletDataSeamController> {
  const state = {
    ethBalance: options.ethBalance ?? 0,
    ethPriceEur: options.ethPriceEur ?? 2_000,
    activities: options.activities ?? [],
    nativeTokenBody: options.nativeTokenBody,
    feeRate: null as GasFeesJson | null,
  }

  const fulfillJson = (route: Route, data: unknown) =>
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      headers: { 'access-control-allow-origin': '*' },
      body: JSON.stringify(data),
    })

  // --- Enhanced / off-chain tRPC endpoints (page-context) ---------------------
  await context.route('**/api/trpc/**', async route => {
    const url = route.request().url()
    const proc = procedureOf(url)

    switch (proc) {
      case 'assets.all':
        return fulfillJson(
          route,
          trpcJson({
            assets: [nativeEthAsset(state.ethBalance, state.ethPriceEur)],
          }),
        )
      case 'assets.nativeToken':
        // Serve the pre-captured, balance-patched TokenData when provided;
        // otherwise pass through to apps/api.
        if (state.nativeTokenBody !== undefined) {
          return fulfillJson(route, trpcJson(state.nativeTokenBody))
        }
        return route.continue()
      case 'activities.page':
        return fulfillJson(
          route,
          trpcJson({ activities: state.activities, nextPageKeys: {} }),
        )
      case 'nodes.getFeeRate':
        // Deterministic gas-fee control for the gas-shifted test; otherwise the
        // real fork estimate.
        if (state.feeRate) {
          return fulfillJson(route, trpcJson(state.feeRate))
        }
        return route.continue()
      default:
        // rpc.proxy / nodes.* / anything else -> real backend -> fork.
        if (
          options.logUnmocked &&
          proc &&
          proc !== 'rpc.proxy' &&
          !proc.startsWith('nodes.')
        ) {
          console.log(`[data-seam] un-mocked tRPC procedure: ${proc}`)
        }
        return route.continue()
    }
  })

  // --- li.quest (swap quotes) -------------------------------------------------
  if (options.lifi) {
    await context.route('**/li.quest/**', async route => {
      const request = route.request()
      // CORS preflight for the widget's cross-origin JSON POSTs.
      if (request.method() === 'OPTIONS') {
        return route.fulfill({
          status: 204,
          headers: {
            'access-control-allow-origin': '*',
            'access-control-allow-methods': 'GET,POST,OPTIONS',
            'access-control-allow-headers': '*',
          },
        })
      }
      const { status, body } = options.lifi!.handle(
        request.url(),
        request.method(),
        request.postData(),
      )
      return route.fulfill({
        status,
        contentType: 'application/json',
        headers: { 'access-control-allow-origin': '*' },
        body: JSON.stringify(body),
      })
    })
  }

  return {
    setEthBalance: (balance: number) => {
      state.ethBalance = balance
    },
    setActivities: (activities: unknown[]) => {
      state.activities = activities
    },
    setFeeRate: (fees: GasFeesJson | null) => {
      state.feeRate = fees
    },
  }
}
