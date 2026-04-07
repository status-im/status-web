import {
  loadEnvConfig,
  requireWalletPassword,
  requireWalletSeedPhrase,
} from '@config/env.js'
import { CHAIN_ID_LINEA, CHAIN_ID_MAINNET } from '@constants/chain-ids.js'
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
 * Anvil fixture — deposit tests against local Anvil forks.
 *
 * Lifecycle: first test snapshots base state → each test reverts → re-snapshots → funds → runs.
 *
 * RPC interception (two layers):
 *   Layer 1: SW fetch patch (file-level, before LavaMoat) — MetaMask internal RPC
 *   Layer 2: context.route() — Hub frontend RPC (wagmi http transports)
 *
 * Playwright's context.route() does NOT intercept service worker fetch().
 * Worker.evaluate() is blocked by LavaMoat. Hence the file-level patch.
 */

// Module-level state — safe with workers: 1
let baseSnapshots: { mainnet: string; linea: string } | null = null
let originalSwContent: string | null = null
let swFilePath: string | null = null

interface AnvilFixtures {
  anvilRpc: AnvilRpcHelper
  preDepositsPage: PreDepositsPage
  depositModal: PreDepositModalComponent
}

export const test = walletTest.extend<AnvilFixtures>({
  extensionContext: async ({}, use) => {
    const env = loadEnvConfig()

    await launchMetaMaskContext(use, {
      beforeLaunch: extensionPath => {
        swFilePath = path.join(extensionPath, 'scripts', 'app-init.js')
        const currentContent = fs.readFileSync(swFilePath, 'utf-8')

        if (currentContent.includes(PATCH_MARKER)) {
          // Previous run didn't clean up — strip old patch
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

        disableSmartTransactionsInFiles(extensionPath)
      },
      afterClose: () => {
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

  metamask: async ({ extensionContext, extensionId }, use) => {
    const metamask = new MetaMaskPage(extensionContext, extensionId)
    const seedPhrase = requireWalletSeedPhrase()
    const password = requireWalletPassword()

    const MAX_ATTEMPTS = 2
    const onboardStart = Date.now()

    for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
      try {
        await metamask.onboarding.importWallet(seedPhrase, password)
        console.log(
          `[anvil-fixture] Onboarding done in ${Date.now() - onboardStart}ms`,
        )
        break
      } catch (err) {
        console.warn(
          `[anvil-fixture] Onboarding attempt ${attempt}/${MAX_ATTEMPTS} failed: ${err}`,
        )
        if (attempt === MAX_ATTEMPTS) throw err
        for (const page of extensionContext.pages()) {
          if (page.url().includes('chrome-extension:'))
            await page.close().catch(() => {})
        }
        await new Promise(r => setTimeout(r, 2_000))
      }
    }

    const homePage = await metamask.getExtensionPage()
    await homePage.waitForLoadState('load')
    console.log('[anvil-fixture] MetaMask home loaded (SW warm-up)')

    await use(metamask)
  },

  anvilRpc: async ({}, use, testInfo) => {
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

    const anvilStart = Date.now()

    if (!baseSnapshots) {
      await helper.requireHealthy()

      await Promise.all([
        helper.setEthBalance(10n * 10n ** 18n),
        helper.setEthBalance(10n * 10n ** 18n, helper.lineaRpc),
      ])
      await helper.enableAllVaults()

      baseSnapshots = await helper.snapshotBoth()

      const warmupStart = Date.now()
      await helper.revertBoth(baseSnapshots)
      console.log(
        `[anvil-fixture] Warm-up revert: ${Date.now() - warmupStart}ms`,
      )

      await Promise.all([
        helper.setEthBalance(10n * 10n ** 18n),
        helper.setEthBalance(10n * 10n ** 18n, helper.lineaRpc),
      ])
      await helper.enableAllVaults()
      baseSnapshots = await helper.snapshotBoth()

      console.log(
        `[anvil-fixture] Initial setup done in ${Date.now() - anvilStart}ms`,
      )
    } else {
      try {
        const rt0 = Date.now()
        await helper.revert(baseSnapshots.mainnet, helper.mainnetRpc)
        const rt1 = Date.now()
        await helper.revert(baseSnapshots.linea, helper.lineaRpc)
        const rt2 = Date.now()
        console.log(
          `[anvil-fixture] revert mainnet: ${rt1 - rt0}ms, linea: ${rt2 - rt1}ms`,
        )
      } catch (err) {
        console.log(
          `[anvil-fixture] revertBoth failed: ${err instanceof Error ? err.message : err}. ` +
            `Re-establishing base state from current Anvil state.`,
        )
        // Zero out stale token balances from previous test.
        // SNT excluded: MiniMeToken uses checkpoint storage, can't be zeroed via slots.
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
      const st0 = Date.now()
      const mainnetSnap = await helper.snapshot(helper.mainnetRpc)
      const st1 = Date.now()
      const lineaSnap = await helper.snapshot(helper.lineaRpc)
      const st2 = Date.now()
      baseSnapshots = { mainnet: mainnetSnap, linea: lineaSnap }
      console.log(
        `[anvil-fixture] snapshot mainnet: ${st1 - st0}ms, linea: ${st2 - st1}ms`,
      )
      console.log(
        `[anvil-fixture] Revert/snapshot done in ${Date.now() - anvilStart}ms`,
      )
    }

    // Force auto-mining — interval mining can leave the second tx in
    // approve → deposit flows pending with null receipt indefinitely
    await helper.enableAutoMining()
    await helper.enableAutoMining(helper.lineaRpc)

    await use(helper)
  },

  preDepositsPage: async ({ hubPage }, use) => {
    await use(new PreDepositsPage(hubPage))
  },
  depositModal: async ({ hubPage }, use) => {
    await use(new PreDepositModalComponent(hubPage))
  },

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  hubPage: async ({ extensionContext, metamask, anvilRpc: _anvilRpc }, use) => {
    const env = loadEnvConfig()

    // Context-level route: intercept Hub's own RPC calls (wagmi http transports).
    // MetaMask SW requests are handled by Layer 1 (file-level fetch patch).
    //
    // Chain discovery: 1) ?chainId= query param, 2) hostname lookup, 3) eth_chainId probe.
    // Check Linea FIRST — 'linea-mainnet.infura.io' contains 'mainnet.infura.io'.
    const getChainIdByHostname = (url: string): number | null => {
      try {
        const hostname = new URL(url).hostname
        if (KNOWN_LINEA_HOSTS.some(h => hostname.includes(h)))
          return CHAIN_ID_LINEA
        if (KNOWN_MAINNET_HOSTS.some(h => hostname.includes(h)))
          return CHAIN_ID_MAINNET
      } catch {
        // ignore URL parsing errors
      }
      return null
    }

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
      if (postData.includes('"method":"linea_')) return route.continue()

      const url = request.url()
      if (url.startsWith('chrome-extension:') || url.includes('localhost')) {
        return route.continue()
      }

      if (!rpcRedirectCache.has(url)) {
        const chainIdParam = new URL(url).searchParams.get('chainId')
        if (chainIdParam) {
          const chainId = Number(chainIdParam)
          if (chainId === CHAIN_ID_MAINNET)
            rpcRedirectCache.set(url, env.ANVIL_MAINNET_RPC)
          else if (chainId === CHAIN_ID_LINEA)
            rpcRedirectCache.set(url, env.ANVIL_LINEA_RPC)
          else rpcRedirectCache.set(url, null)
        } else {
          const knownChainId = getChainIdByHostname(url)
          if (knownChainId !== null) {
            if (knownChainId === CHAIN_ID_MAINNET)
              rpcRedirectCache.set(url, env.ANVIL_MAINNET_RPC)
            else if (knownChainId === CHAIN_ID_LINEA)
              rpcRedirectCache.set(url, env.ANVIL_LINEA_RPC)
            else rpcRedirectCache.set(url, null)
          } else {
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
                if (chainId === CHAIN_ID_MAINNET)
                  probeResult = env.ANVIL_MAINNET_RPC
                else if (chainId === CHAIN_ID_LINEA)
                  probeResult = env.ANVIL_LINEA_RPC
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

      // Receipt requests may hit the wrong fork after network switches —
      // try both forks before returning null
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

        return route.fulfill({
          status: primary.status,
          contentType: 'application/json',
          body: primary.body,
        })
      } catch {
        return route.abort('connectionrefused')
      }
    })

    const MAX_CONNECT_ATTEMPTS = 2
    let connectedPage: Page | null = null

    for (let attempt = 1; attempt <= MAX_CONNECT_ATTEMPTS; attempt++) {
      let page: Page | null = null
      try {
        page = await extensionContext.newPage()

        // Block wallet_addEthereumChain BEFORE navigation.
        // addInitScript runs before any page script, eliminating the race
        // where the Hub fires addEthereumChain before a post-goto evaluate().
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
                console.log('[eth-patch] blocked wallet_addEthereumChain')
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

        page.on('console', msg => {
          const text = msg.text()
          if (text.includes('[eth-patch]') || msg.type() === 'error')
            console.log(`[hub-page][${msg.type()}] ${text}`)
        })
        page.on('pageerror', err => {
          console.log(`[hub-page][pageerror] ${err.message}`)
        })

        const connectStart = Date.now()
        await page.goto(env.BASE_URL, {
          waitUntil: 'domcontentloaded',
          timeout: 60_000,
        })
        console.log(
          `[anvil-fixture] Hub loaded in ${Date.now() - connectStart}ms`,
        )

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

    // Dismiss any addEthereumChain that slipped through before the patch activated
    await metamask.dismissPendingAddNetwork()

    await use(connectedPage!)

    await extensionContext.unrouteAll({ behavior: 'ignoreErrors' })
  },
})
