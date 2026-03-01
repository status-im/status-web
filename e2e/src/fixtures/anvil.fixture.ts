import {
  loadEnvConfig,
  requireWalletPassword,
  requireWalletSeedPhrase,
} from '@config/env.js'
import { KNOWN_LINEA_HOSTS, KNOWN_MAINNET_HOSTS } from '@constants/rpc-hosts.js'
import { AnvilRpcHelper } from '@helpers/anvil-rpc.js'
import {
  buildServiceWorkerPatch,
  PATCH_MARKER,
} from '@helpers/service-worker-patch.js'
import {
  disableSmartTransactionsInFiles,
  restoreSmartTransactionsFiles,
} from '@helpers/stx-patcher.js'
import { PreDepositModalComponent } from '@pages/hub/components/pre-deposit-modal.component.js'
import { PreDepositsPage } from '@pages/hub/pre-deposits.page.js'
import { MetaMaskPage } from '@pages/metamask/metamask.page.js'
import fs from 'node:fs'
import path from 'node:path'

import { test as walletTest } from './hub/wallet-connected.fixture.js'
import { launchMetaMaskContext } from './metamask.fixture.js'

import type { Page } from '@playwright/test'

/**
 * Anvil fixture — extends wallet-connected for deposit tests against Anvil forks.
 *
 * Lifecycle per test:
 * 1. First test: health-check Anvil, take initial snapshots (base state)
 * 2. Each test: revert to base snapshot → re-snapshot → test-specific funding → run
 * 3. Result: every test starts from identical clean state (ETH + vaults, no tokens)
 *
 * RPC interception (two layers):
 *
 *   Layer 1 — Service worker fetch() patch (file-level, before LavaMoat):
 *   MetaMask v13 (MV3) uses a service worker for ALL internal RPC calls: gas
 *   estimation, tx simulation, balance queries, nonce lookups. Playwright's
 *   context.route() does NOT intercept service-worker-initiated fetch() calls,
 *   and Worker.evaluate() is blocked by MetaMask's LavaMoat scuttling.
 *   We prepend a fetch wrapper to MetaMask's service worker entry point
 *   (scripts/app-init.js) BEFORE launching the browser, so it runs before
 *   LavaMoat locks down globals. The wrapper redirects mainnet/Linea RPC
 *   requests to the local Anvil forks.
 *
 *   Layer 2 — Context-level route (via context.route):
 *   The Hub frontend reads chain data via its own HTTP transports (wagmi http()),
 *   not through MetaMask's provider. These page-level requests ARE caught by
 *   context.route(). We intercept and forward matching chains to Anvil.
 *
 * Fail-fast: if Anvil is not running, tests fail immediately with a clear message.
 * Use the `anvil-deposits` Playwright project (not runtime skip).
 *
 * Prerequisites:
 * - Anvil forks running: cd e2e && pnpm anvil:up
 * - ANVIL_MAINNET_RPC + ANVIL_LINEA_RPC in e2e/.env
 */

// Module-level snapshot storage — persists across tests within the same worker.
// Safe because workers: 1 (MetaMask extension is singleton).
let baseSnapshots: { mainnet: string; linea: string } | null = null

// Track original service worker content for cleanup
let originalSwContent: string | null = null
let swFilePath: string | null = null

interface AnvilFixtures {
  anvilRpc: AnvilRpcHelper
  preDepositsPage: PreDepositsPage
  depositModal: PreDepositModalComponent
}

export const test = walletTest.extend<AnvilFixtures>({
  // Override extensionContext to patch MetaMask's service worker and STX files
  // before launch. Uses launchMetaMaskContext from metamask.fixture to avoid
  // duplicating browser launch logic.
  extensionContext: async ({}, use) => {
    const env = loadEnvConfig()

    await launchMetaMaskContext(use, {
      beforeLaunch: extensionPath => {
        // ── Patch MetaMask's service worker ──
        swFilePath = path.join(extensionPath, 'scripts', 'app-init.js')
        const currentContent = fs.readFileSync(swFilePath, 'utf-8')

        if (currentContent.includes(PATCH_MARKER)) {
          // Already patched (previous run didn't clean up) — strip old patch
          const patchEnd = currentContent.indexOf('})();\n')
          if (patchEnd !== -1) {
            originalSwContent = currentContent.slice(
              patchEnd + '})();\n'.length,
            )
          } else {
            originalSwContent = currentContent
          }
        } else {
          originalSwContent = currentContent
        }

        if (env.ANVIL_MAINNET_RPC && env.ANVIL_LINEA_RPC) {
          const patch = buildServiceWorkerPatch(
            env.ANVIL_MAINNET_RPC,
            env.ANVIL_LINEA_RPC,
          )
          fs.writeFileSync(swFilePath, patch + originalSwContent)
        }

        // ── Disable Smart Transactions in MetaMask's compiled files ──
        disableSmartTransactionsInFiles(extensionPath)
      },
      afterClose: () => {
        // ── Restore patched extension files ──
        if (originalSwContent !== null && swFilePath) {
          fs.writeFileSync(swFilePath, originalSwContent)
        }
        restoreSmartTransactionsFiles()
      },
      extraChromeArgs: [
        '--disable-gpu',
        '--disable-software-rasterizer',
        '--disable-dev-shm-usage',
      ],
    })
  },

  // Override metamask fixture to add retry around importWallet.
  // The inherited wallet-connected fixture calls importWallet without a timeout
  // guard, and on resource-constrained runs (4th+ test), onboarding can hang.
  metamask: async ({ extensionContext, extensionId }, use) => {
    const metamask = new MetaMaskPage(extensionContext, extensionId)
    const seedPhrase = requireWalletSeedPhrase()
    const password = requireWalletPassword()

    const MAX_ATTEMPTS = 2

    for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
      try {
        await metamask.onboarding.importWallet(seedPhrase, password)
        break
      } catch (err) {
        console.warn(
          `[anvil-fixture] Onboarding attempt ${attempt}/${MAX_ATTEMPTS} failed: ${err}`,
        )
        if (attempt === MAX_ATTEMPTS) throw err
        // Close all extension pages and retry onboarding from scratch
        for (const page of extensionContext.pages()) {
          if (page.url().includes('chrome-extension:'))
            await page.close().catch(() => {})
        }
        await new Promise(r => setTimeout(r, 2_000))
      }
    }

    await use(metamask)
  },

  anvilRpc: async ({}, use, testInfo) => {
    // Guard: module-level state (baseSnapshots, SW content, STX patches)
    // is not safe for concurrent workers.
    if (testInfo.config.workers > 1) {
      throw new Error(
        'anvil.fixture requires workers: 1 (module-level snapshot state is not worker-safe)',
      )
    }

    const env = loadEnvConfig()

    if (!env.ANVIL_MAINNET_RPC || !env.ANVIL_LINEA_RPC) {
      throw new Error(
        'ANVIL_MAINNET_RPC and ANVIL_LINEA_RPC must be set for anvil-deposits tests. ' +
          'Run: cd e2e && pnpm anvil:up',
      )
    }

    const walletAddress = env.WALLET_ADDRESS
    if (!walletAddress) {
      throw new Error(
        'WALLET_ADDRESS could not be determined. ' +
          'Set WALLET_SEED_PHRASE in .env (address is auto-derived), ' +
          'or set WALLET_ADDRESS explicitly.',
      )
    }

    const helper = new AnvilRpcHelper(
      env.ANVIL_MAINNET_RPC,
      env.ANVIL_LINEA_RPC,
      walletAddress,
    )

    // First test in the run: base setup + snapshots.
    // Replaces the shell script's base_setup (ETH funding + vault enabling).
    if (!baseSnapshots) {
      await helper.requireHealthy()

      await Promise.all([
        helper.setEthBalance(10n * 10n ** 18n),
        helper.setEthBalance(10n * 10n ** 18n, helper.lineaRpc),
      ])
      await helper.enableAllVaults()

      baseSnapshots = await helper.snapshotBoth()
    } else {
      // Subsequent tests: revert to clean state.
      // If revert fails (snapshot consumed/invalid), re-establish base state
      // from the current (dirty) Anvil state to prevent cascading failures.
      try {
        await helper.revertBoth(baseSnapshots)
      } catch (err) {
        console.log(
          `[anvil-fixture] revertBoth failed: ${err instanceof Error ? err.message : err}. ` +
            `Re-establishing base state from current Anvil state.`,
        )
        // Re-establish base state: fund ETH, zero out stale token balances,
        // and enable vaults. Without zeroing tokens, a previous test's funded
        // balances persist and pollute subsequent tests.
        // Note: SNT uses MiniMeToken (checkpoint-based storage) and cannot be
        // zeroed via storage slot manipulation. SNT tests use generateTokens
        // which adds to the existing balance — acceptable for the rare
        // revert-failure scenario.
        await Promise.all([
          helper.setEthBalance(10n * 10n ** 18n),
          helper.setEthBalance(10n * 10n ** 18n, helper.lineaRpc),
          helper.fundWeth(0n),
          helper.fundLinea(0n),
          helper.fundUsdt(0n),
          helper.fundUsdc(0n),
          helper.fundUsds(0n),
        ])
        await helper.enableAllVaults()
      }
      // Re-snapshot immediately (revert consumes the snapshot)
      baseSnapshots = await helper.snapshotBoth()
    }

    // Force auto-mining on both forks before each test.
    // We observed intermittent cases where interval mining leaves the second
    // tx (approve -> deposit flow) pending with null receipt indefinitely.
    // Auto-mining keeps transaction confirmation deterministic for UI polling.
    await helper.enableAutoMining()
    await helper.enableAutoMining(helper.lineaRpc)

    await use(helper)
  },

  // Lazy-evaluated Playwright fixtures — instantiated only when used by a test.
  preDepositsPage: async ({ hubPage }, use) => {
    await use(new PreDepositsPage(hubPage))
  },
  depositModal: async ({ hubPage }, use) => {
    await use(new PreDepositModalComponent(hubPage))
  },

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  hubPage: async ({ extensionContext, metamask, anvilRpc: _anvilRpc }, use) => {
    const env = loadEnvConfig()

    // ── Context-level route for Hub page requests ──────────────────────
    //
    // The Hub frontend makes RPC calls via its own HTTP transports (wagmi
    // public client → tRPC proxy or direct RPC endpoints). These are page-
    // level fetch() calls that context.route() CAN intercept.
    //
    // MetaMask's service worker requests are handled by Layer 1 (the file-
    // level fetch patch applied before browser launch).
    //
    // Chain discovery uses three strategies:
    //   1. Parse ?chainId= query param (tRPC proxy: /api/trpc/rpc.proxy?chainId=1)
    //   2. Hostname-based lookup for known RPC providers (no network needed)
    //   3. Probe with eth_chainId as fallback (with one retry on failure)
    // Known RPC hostname → chainId mapping (from constants/rpc-hosts.ts).
    // Eliminates the need for eth_chainId probes on well-known providers,
    // preventing transient network failures from permanently caching null
    // (which would leak requests to the real chain and cause flaky balance reads).
    const getChainIdByHostname = (url: string): number | null => {
      try {
        const hostname = new URL(url).hostname
        // Check Linea FIRST — 'linea-mainnet.infura.io' contains 'mainnet.infura.io'
        // as a substring, so checking mainnet first would misclassify Linea URLs.
        if (KNOWN_LINEA_HOSTS.some(h => hostname.includes(h))) return 59144
        if (KNOWN_MAINNET_HOSTS.some(h => hostname.includes(h))) return 1
      } catch {
        // ignore URL parsing errors
      }
      return null
    }

    // Result is cached per URL for the lifetime of the context.
    const rpcRedirectCache = new Map<string, string | null>()
    const txReceiptMethodPattern = /"method"\s*:\s*"eth_getTransactionReceipt"/

    const hasNonNullRpcResult = (responseBody: string): boolean => {
      try {
        const parsed = JSON.parse(responseBody) as
          | { result?: unknown }
          | Array<{ result?: unknown }>
        if (Array.isArray(parsed)) {
          return parsed.some(
            item => item && item.result !== null && item.result !== undefined,
          )
        }
        return parsed.result !== null && parsed.result !== undefined
      } catch {
        return false
      }
    }

    const forwardRpcToAnvil = async (anvilUrl: string, body: string) => {
      const res = await fetch(anvilUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body,
      })
      return {
        status: res.status,
        body: await res.text(),
      }
    }

    await extensionContext.route('**/*', async route => {
      const request = route.request()
      if (request.method() !== 'POST') return route.continue()

      const postData = request.postData()
      if (!postData?.includes('"jsonrpc"')) return route.continue()
      // Keep Linea-specific RPC methods on upstream providers to preserve
      // provider-specific response format used for fee calculation.
      if (postData.includes('"method":"linea_')) return route.continue()

      const url = request.url()
      // Never intercept extension-internal or localhost requests
      if (url.startsWith('chrome-extension:') || url.includes('localhost')) {
        return route.continue()
      }

      // Lazy-discover which chain this endpoint serves
      if (!rpcRedirectCache.has(url)) {
        // Strategy 1: extract chainId from URL query parameter
        // (e.g. tRPC proxy: /api/trpc/rpc.proxy?chainId=1)
        const chainIdParam = new URL(url).searchParams.get('chainId')
        if (chainIdParam) {
          const chainId = Number(chainIdParam)
          if (chainId === 1) rpcRedirectCache.set(url, env.ANVIL_MAINNET_RPC)
          else if (chainId === 59144)
            rpcRedirectCache.set(url, env.ANVIL_LINEA_RPC)
          else rpcRedirectCache.set(url, null)
        } else {
          // Strategy 2: hostname-based lookup (no network needed)
          const knownChainId = getChainIdByHostname(url)
          if (knownChainId !== null) {
            if (knownChainId === 1)
              rpcRedirectCache.set(url, env.ANVIL_MAINNET_RPC)
            else if (knownChainId === 59144)
              rpcRedirectCache.set(url, env.ANVIL_LINEA_RPC)
            else rpcRedirectCache.set(url, null)
          } else {
            // Strategy 3: probe with eth_chainId (retry once on failure)
            let probeResult: string | null = null
            for (let attempt = 0; attempt < 2; attempt++) {
              try {
                const probe = await fetch(url, {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    jsonrpc: '2.0',
                    method: 'eth_chainId',
                    params: [],
                    id: 1,
                  }),
                })
                const json = (await probe.json()) as { result: string }
                const chainId = parseInt(json.result, 16)
                if (chainId === 1) probeResult = env.ANVIL_MAINNET_RPC
                else if (chainId === 59144) probeResult = env.ANVIL_LINEA_RPC
                break
              } catch (err) {
                if (attempt === 0) {
                  console.warn(
                    `[anvil-intercept] Probe attempt 1 failed for ${url}, retrying...`,
                  )
                  await new Promise(r => setTimeout(r, 500))
                } else {
                  console.warn(
                    `[anvil-intercept] Probe failed permanently for ${url}: ${err}`,
                  )
                }
              }
            }
            rpcRedirectCache.set(url, probeResult)
          }
        }
      }

      const anvilUrl = rpcRedirectCache.get(url)
      if (!anvilUrl) return route.continue()

      // eth_getTransactionReceipt requests can be misrouted after network
      // switches. If the primary fork returns null, fall back to the other
      // fork before returning the response.
      const isTxReceiptRequest = txReceiptMethodPattern.test(postData)
      const fallbackAnvilUrl =
        anvilUrl === env.ANVIL_LINEA_RPC
          ? env.ANVIL_MAINNET_RPC
          : env.ANVIL_LINEA_RPC

      try {
        const primary = await forwardRpcToAnvil(anvilUrl, postData)

        if (!isTxReceiptRequest) {
          return route.fulfill({
            status: primary.status,
            contentType: 'application/json',
            body: primary.body,
          })
        }

        if (primary.status === 200 && hasNonNullRpcResult(primary.body)) {
          return route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: primary.body,
          })
        }

        const fallback = await forwardRpcToAnvil(fallbackAnvilUrl, postData)
        if (fallback.status === 200 && hasNonNullRpcResult(fallback.body)) {
          return route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: fallback.body,
          })
        }

        // Preserve original semantics when both forks return null/pending.
        return route.fulfill({
          status: primary.status,
          contentType: 'application/json',
          body: primary.body,
        })
      } catch {
        // Anvil unreachable — abort so the test fails loudly instead of
        // silently falling through to the real RPC (where balances are 0).
        return route.abort('connectionrefused')
      }
    })

    // ── Page creation + connection with retry ──
    const MAX_CONNECT_ATTEMPTS = 2
    let connectedPage: Page | null = null

    for (let attempt = 1; attempt <= MAX_CONNECT_ATTEMPTS; attempt++) {
      let page: Page | null = null
      try {
        page = await extensionContext.newPage()

        // Block wallet_addEthereumChain BEFORE navigation via addInitScript.
        // This runs before any page script, eliminating the race condition where
        // the Hub fires addEthereumChain before a post-goto page.evaluate() patch.
        // MetaMask injects window.ethereum at document_start; the Hub reads it
        // after DOMContentLoaded. Polling at 10ms bridges the gap.
        await page.addInitScript(() => {
          function patchEthereum() {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const eth = (window as any).ethereum
            if (!eth || eth.__addChainBlocked) return false
            eth.__addChainBlocked = true
            const orig = eth.request.bind(eth)
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            eth.request = async (args: any) => {
              if (args.method === 'wallet_addEthereumChain') {
                return null
              }
              return orig(args)
            }
            return true
          }
          if (!patchEthereum()) {
            const id = setInterval(() => {
              if (patchEthereum()) clearInterval(id)
            }, 10)
            setTimeout(() => clearInterval(id), 5_000)
          }
        })

        await page.goto(env.BASE_URL)
        await page.waitForLoadState('domcontentloaded')

        await metamask.connectToDApp(page)
        connectedPage = page
        break
      } catch (err) {
        console.warn(
          `[anvil-fixture] Connect attempt ${attempt}/${MAX_CONNECT_ATTEMPTS} failed: ${err}`,
        )
        if (page) await page.close().catch(() => {})
        if (attempt === MAX_CONNECT_ATTEMPTS) throw err
        await new Promise(r => setTimeout(r, 2_000))
      }
    }

    // Safety net: dismiss any wallet_addEthereumChain requests that slipped through
    // before the addInitScript provider patch activated.
    await metamask.dismissPendingAddNetwork()

    await use(connectedPage!)

    // Clean up context-level route when test finishes
    await extensionContext.unrouteAll({ behavior: 'ignoreErrors' })
  },
})
