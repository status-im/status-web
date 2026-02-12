# Flaky Tests Analysis

Results from 5x repetitions per test (55 total runs), 2 failures observed.

---

## L-1: LINEA deposit with network switch

**Test:** `tests/hub/pre-deposits/linea-deposit.spec.ts` — "L-1: deposit LINEA tokens with network switch"
**Flake rate:** 1/5 (20%)
**Failed step:** `Verify deposit success (modal closes)` — line 58, `depositModal.expectModalClosed()` (30s timeout)

### What happened

The approve-token-spend tx completed successfully ("Approve LINEA spending cap" — Confirmed in MetaMask Activity), but the subsequent deposit tx remained in "Pending" state in MetaMask and never got mined within the 30s `MODAL_CLOSE` timeout.

### Screenshots

| #                 | Content                                                                               |
| ----------------- | ------------------------------------------------------------------------------------- |
| test-failed-1.png | Blank white page (Hub page — lost context or not rendered)                            |
| test-failed-2.png | MetaMask "Your wallet is ready!" onboarding page                                      |
| test-failed-3.png | MetaMask Activity tab: "Deposit — Pending" + "Approve LINEA spending cap — Confirmed" |
| test-failed-4.png | Hub modal stuck on "Depositing..." with 10 LINEA entered                              |

### Root cause hypothesis

The deposit tx was submitted by MetaMask (visible as "Pending" in Activity), but Anvil never mined it — or MetaMask's receipt polling couldn't find the receipt on the correct fork.

Likely causes (in order of probability):

1. **STX routing race on Linea:** MetaMask may have routed the deposit tx through its Smart Transactions relay despite the STX disable patches. The relay submits to real Linea mainnet (not Anvil), so the tx never mines locally. The fetch wrapper intercepts STX API calls and forwards raw txs to Anvil, but there's a timing window where MetaMask decides to use STX routing before the interceptor can fully process the response.

2. **Receipt polling cross-fork misroute:** After the network switch from Ethereum to Linea, MetaMask's receipt polling may still target the Ethereum fork. The `_fwdReceiptWithFallback` mechanism in the service worker patch handles this, but if the tx hash wasn't captured in `_tx[]` (e.g., STX submission path), the fallback has no preferred fork and may return null from both forks in a race.

3. **Auto-mining deactivated between tests:** The fixture calls `enableAutoMining()` at setup, but interval mining may have been restored by Anvil after a `evm_snapshot`/`evm_revert` cycle. If the second tx in the approve→deposit flow lands during an interval gap, it stays pending.

### Suggested fixes

- [ ] Add explicit `evm_mine` after detecting "Depositing..." state persists >10s
- [ ] Increase `MODAL_CLOSE` timeout to 60s as a safety net for Linea deposit (network switch adds latency)
- [ ] Add `enableAutoMining()` call at the start of Linea-specific tests (belt-and-suspenders)
- [ ] Investigate if MetaMask's batchStatus polling for STX returns `not_mined` on Linea chain even after `_stxHashes` mapping is populated — potential timing issue between `submitTransactions` and `batchStatus` poll intervals

---

## W-2: WETH deposit (skip wrap)

**Test:** `tests/hub/pre-deposits/weth-deposit.spec.ts` — "W-2: deposit with sufficient WETH (skip wrap)"
**Flake rate:** 1/5 (20%), failed on repeat 4 of 5
**Failed step:** Fixture setup — "Test timeout of 120000ms exceeded while setting up `anvilRpc`"

### What happened

The test timed out during the `anvilRpc` fixture setup phase (before any test steps ran). The browser/MetaMask extension failed to initialize within the 120s test timeout on the 4th consecutive headed browser launch.

### Screenshots

| #                 | Content                                                                              |
| ----------------- | ------------------------------------------------------------------------------------ |
| test-failed-1.png | Blank white page (Hub never loaded)                                                  |
| test-failed-2.png | MetaMask "Your wallet is ready!" onboarding (setup didn't complete)                  |
| test-failed-3.png | MetaMask main page: "Fund your wallet" with 0 balances (fresh state, no Anvil funds) |

### Root cause hypothesis

Resource exhaustion after 3 sequential headed browser launches. Each test in the `anvil-deposits` project:

1. Launches a full Chromium instance with MetaMask extension
2. Patches and restores MetaMask source files on disk
3. Creates a persistent browser context with a temp profile

On repeat 4, the system likely hit one of:

1. **MetaMask onboarding hung:** The MetaMask setup flow (import wallet from seed phrase) involves multiple pages and animations. On the 4th launch, MetaMask may have taken longer to initialize than the fixture's implicit timeout, causing the `connectToDApp` or `metamask.setup()` calls to stall.

2. **Stale browser profile / extension cache:** Chromium may cache extension state across launches. If a previous launch's cleanup (temp profile deletion, extension file restore) was incomplete, the 4th launch could encounter corrupted extension state.

3. **Port/process contention:** Docker Anvil containers, 3 previous Chromium instances (if cleanup was delayed), and system resources may have degraded performance enough to exceed the 120s timeout on the 4th iteration.

### Evidence supporting resource exhaustion

- Failed specifically on repeat 4 (not 1, 2, or 3) — progressive degradation pattern
- MetaMask shows fresh "Your wallet is ready!" state — import succeeded but subsequent steps (navigate to Hub, connect dApp) timed out
- Screenshot 3 shows 0 balances — `anvilRpc` fixture never reached the `fund()` step

### Suggested fixes

- [ ] Add an explicit timeout to MetaMask onboarding steps with retry (re-launch browser if setup takes >60s)
- [ ] Force GC between test runs: kill stale Chromium processes from previous iterations
- [ ] Add `--disable-gpu` and `--disable-software-rasterizer` flags to reduce resource pressure in headed mode
- [ ] Consider running repeat tests with `--workers=1` and adding explicit cleanup pauses between iterations
- [ ] Profile memory/CPU during 5x runs to confirm whether resource exhaustion correlates with failure

---

## Summary

| Test | Failure type                             | Flake rate | Severity | Fix priority                                       |
| ---- | ---------------------------------------- | ---------- | -------- | -------------------------------------------------- |
| L-1  | Deposit tx stuck Pending (modal timeout) | 1/5        | Medium   | High — affects real deposit flow reliability       |
| W-2  | Fixture setup timeout (browser launch)   | 1/5        | Low      | Medium — only triggers on repeated sequential runs |

Both failures are pre-existing UI/infrastructure flakes, not related to the Phase 1 Docker/retry changes.
