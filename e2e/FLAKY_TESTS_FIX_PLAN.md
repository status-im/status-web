# Fix Flaky E2E Tests: L-1 Linea Deposit & W-2 WETH Setup Timeout

## Context

Two e2e deposit tests have a 20% flake rate (1/5 runs), documented in `e2e/FLAKY_TESTS_ANALYSIS.md`. Both are infrastructure-level issues (Anvil mining + browser resources). Two mitigations already exist in code: fire-and-forget `evm_mine` after `eth_sendRawTransaction` (SW patch, line 120) and `enableAutoMining()` on both forks before each test (fixture, line 741).

---

## Fix 1: L-1 Linea Deposit — tx stuck "Pending" forever

### 1a. JSON-parse STX payload instead of regex (anvil.fixture.ts ~line 200-248)

Current code uses regex `/"rawTxs"\s*:\s*\[([^\]]+)\]/` to extract raw txs. Fragile on escaped quotes, nested objects, alternative formats.

Replace regex extraction with `JSON.parse` + support both payload formats:

- Format 1: `{ rawTxs: ["0x..."] }`
- Format 2: `{ transactions: [{ rawTx: "0x..." }] }`

Add `console.warn` if no raw txs extracted (diagnostic telemetry).

Add `_chainByHost(_url)` as third fallback in chain detection (after path regex and query param regex). The function already exists in scope (line 85).

**Telemetry:** Log STX path at each decision point:

```javascript
console.log(
  '[anvil-stx] submitTx chainId=' +
    _stxChainId +
    ' txCount=' +
    _rawTxList.length,
)
console.log('[anvil-stx] batchStatus uuid=' + _uid + ' hasHash=' + !!_hash)
```

### 1b. JSON-parse receipt fallback check (anvil.fixture.ts ~line 141-152)

Current `_hasNonNullRpcResult` uses `indexOf('"result":null')` — fragile on batch responses and non-standard spacing. The route-layer at line 800 already uses proper JSON parsing with Array.isArray + batch support. Port the same approach to the SW patch:

```javascript
function _hasNonNullRpcResult(response) {
  try {
    var c = response.clone()
    return c
      .text()
      .then(function (text) {
        try {
          var parsed = JSON.parse(text)
          if (Array.isArray(parsed)) {
            for (var i = 0; i < parsed.length; i++) {
              if (
                parsed[i] &&
                parsed[i].result !== null &&
                parsed[i].result !== undefined
              )
                return true
            }
            return false
          }
          return parsed.result !== null && parsed.result !== undefined
        } catch (_) {
          return false
        }
      })
      .catch(function () {
        return false
      })
  } catch (_) {
    return Promise.resolve(false)
  }
}
```

### ~~1c. Fire `evm_mine` on ALL forks after STX submission~~ — REMOVED

Deferred. The existing `_fwd()` mechanism (line 120) already fires `evm_mine` after each `eth_sendRawTransaction`. Adding a second volley on both forks after `Promise.all` would duplicate the existing mechanism and create noise without clear benefit. If 1a+1b don't resolve the flake, reconsider.

### 1d. Chain-stability check after network switch (linea-deposit.spec.ts, after line 38)

After `clickSwitchNetwork()` + `expectSwitchNetworkButtonGone()`, wait for the provider to actually serve chain 59144 before approve/deposit. This eliminates the race "UI switched, provider hasn't".

Add a typed helper method to `AnvilRpcHelper` or a dedicated utility instead of inline `(window as any)`:

**Option A — verify via Anvil RPC directly** (preferred, no browser evaluation):

```typescript
// In anvil-rpc.ts — new method
async waitForChain(expectedChainId: number, rpc?: string, timeoutMs = 15_000): Promise<void> {
  const target = rpc ?? this.mainnetRpc
  const hex = '0x' + expectedChainId.toString(16)
  const deadline = Date.now() + timeoutMs
  while (Date.now() < deadline) {
    const result = await this.call(target, 'eth_chainId', []).catch(() => null)
    if (result === hex) return
    await new Promise(r => setTimeout(r, 500))
  }
  throw new Error(`Chain ${expectedChainId} not ready on ${target} within ${timeoutMs}ms`)
}
```

In the test:

```typescript
await test.step('Verify Linea chain is active', async () => {
  await anvilRpc.waitForChain(59144, anvilRpc.lineaRpc)
})
```

**Option B — verify via page provider** (if we need to confirm the browser-side provider):

Add to `PreDepositModalComponent` or a test helper:

```typescript
async expectChainId(page: Page, expectedHex: string, timeoutMs = 15_000): Promise<void> {
  await expect
    .poll(
      async () => {
        return page.evaluate(() => {
          const eth = (window as { ethereum?: { request: (a: { method: string }) => Promise<string> } }).ethereum
          return eth?.request({ method: 'eth_chainId' }).catch(() => null) ?? null
        })
      },
      { timeout: timeoutMs, intervals: [500] },
    )
    .toBe(expectedHex)
}
```

**Recommendation:** Use **both** — Option A confirms Anvil fork is responsive, Option B confirms browser provider switched. But Option B alone is sufficient if we want to keep it simple, since it tests the actual path the deposit tx will take.

---

## Fix 2: W-2 WETH Deposit — fixture setup timeout on 4th run

### 2a. Add Chrome resource-reducing flags (anvil.fixture.ts ~line 671-676)

```typescript
args: [
  `--disable-extensions-except=${extensionPath}`,
  `--load-extension=${extensionPath}`,
  '--no-first-run',
  '--disable-default-apps',
  '--disable-gpu',
  '--disable-software-rasterizer',
  '--disable-dev-shm-usage',
],
```

### 2b. Add retry around `importWallet()` with context restart (anvil.fixture.ts)

The flake occurs AFTER browser launch (screenshots show "Your wallet is ready!" — onboarding completed, but Hub navigate/connect timed out). The current plan's retry on `launchPersistentContext` + SW doesn't cover this.

**Override the `metamask` fixture** in `anvil.fixture.ts` (currently inherited from wallet-connected) to add a timeout guard around `importWallet()`:

```typescript
import { MetaMaskPage } from '@pages/metamask/metamask.page.js'
// ... other imports

export const test = walletTest.extend<{ anvilRpc: AnvilRpcHelper }>({
  // ... extensionContext override (existing)

  metamask: async ({ extensionContext, extensionId }, use) => {
    const metamask = new MetaMaskPage(extensionContext, extensionId)
    const seedPhrase = requireWalletSeedPhrase()
    const password = requireWalletPassword()

    const ONBOARDING_TIMEOUT = 60_000
    const MAX_ATTEMPTS = 2

    for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
      try {
        await Promise.race([
          metamask.onboarding.importWallet(seedPhrase, password),
          new Promise<never>((_, reject) =>
            setTimeout(
              () => reject(new Error('Onboarding exceeded 60s')),
              ONBOARDING_TIMEOUT,
            ),
          ),
        ])
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

  hubPage: async ({ extensionContext, metamask, anvilRpc: _anvilRpc }, use) => {
    // ... existing route setup ...

    // Wrap page.goto + connectToDApp with similar timeout guard
    const CONNECT_TIMEOUT = 45_000
    const MAX_CONNECT_ATTEMPTS = 2
    let page: Page | null = null

    for (let attempt = 1; attempt <= MAX_CONNECT_ATTEMPTS; attempt++) {
      try {
        page = await extensionContext.newPage()
        await page.goto(env.BASE_URL)
        await page.waitForLoadState('domcontentloaded')

        // ... provider patch (existing) ...

        await Promise.race([
          metamask.connectToDApp(page),
          new Promise<never>((_, reject) =>
            setTimeout(
              () => reject(new Error('connectToDApp exceeded 45s')),
              CONNECT_TIMEOUT,
            ),
          ),
        ])
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

    // ... existing dismissPendingAddNetwork + use(page) ...
  },
})
```

This overrides the inherited `metamask` fixture from `wallet-connected.fixture.ts`, so `importWallet` + `requireWalletSeedPhrase`/`requireWalletPassword` calls move here. The original wallet-connected override is no longer used for anvil tests.

### 2c. Explicit page cleanup before context close (anvil.fixture.ts, teardown after line 680)

```typescript
await use(context)

for (const page of context.pages()) {
  await page.close().catch(() => {})
}
await context.close()
fs.rmSync(profileDir, { recursive: true, force: true })
```

### 2d. Increase timeout for `anvil-deposits` project only (playwright.config.ts ~line 58-63)

```typescript
{
  name: 'anvil-deposits',
  grep: /@anvil/,
  timeout: 180_000,
  use: {
    headless: false,
  },
},
```

---

## Files to modify

| File                                               | Changes                                                                                |
| -------------------------------------------------- | -------------------------------------------------------------------------------------- |
| `e2e/src/fixtures/anvil.fixture.ts`                | 1a, 1b (SW patch); 2a (Chrome flags), 2b (metamask + hubPage retry), 2c (page cleanup) |
| `e2e/tests/hub/pre-deposits/linea-deposit.spec.ts` | 1d (chain-stability check after network switch)                                        |
| `e2e/src/helpers/anvil-rpc.ts`                     | 1d helper method `waitForChain()` (if Option A chosen)                                 |
| `e2e/playwright.config.ts`                         | 2d (project-specific timeout 180s)                                                     |

## Verification

1. `cd e2e && npx playwright test tests/hub/pre-deposits/linea-deposit.spec.ts --repeat-each=20 --project=anvil-deposits` — 0 failures
2. `cd e2e && npx playwright test tests/hub/pre-deposits/weth-deposit.spec.ts --repeat-each=10 --project=anvil-deposits` — 0 failures
3. `cd e2e && npx playwright test --project=anvil-deposits` — full suite, run 2-3 times consecutively
