# E2E Test Suite — Code Review Report

**Дата:** 2026-02-28
**Ветка:** `933-ui-tests-for-SN-Hub_anvil_tests`
**Scope:** `e2e/` (~8750 строк, 50+ файлов)

---

## Оглавление

- [Сводная таблица findings](#сводная-таблица-findings)
- [Рекомендуемый порядок исправлений](#рекомендуемый-порядок-исправлений)
- [Ревьюер 1: Playwright-архитектура и тест-дизайн](#ревьюер-1-playwright-архитектура-и-тест-дизайн)
- [Ревьюер 2: Web3/MetaMask автоматизация](#ревьюер-2-web3metamask-автоматизация)
- [Ревьюер 3: TypeScript качество кода](#ревьюер-3-typescript-качество-кода)
- [Ревьюер 4: Инфраструктура и DevEx](#ревьюер-4-инфраструктура-и-devex)

---

## Сводная таблица findings

### CRITICAL

| #   | Описание                                                                                                                                                          | Файл                           | Ревьюер |
| --- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------ | ------- |
| 1   | ✅ **CI запускает @anvil тесты без Anvil** — `pnpm test` = `playwright test` запускает ВСЕ проекты. Anvil не стартует в CI → тесты падают 3 раза каждый, тратя время | `.github/workflows/e2e.yml:88` | R1, R4  |

### HIGH

| #   | Описание                                                                                                                                                                                | Файл                                          | Ревьюер |
| --- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------- | ------- |
| 2   | ✅ **Расхождение hostname списков** — SW patch имеет 4 Linea хоста, context route — только 2. `linea.drpc.org` и `linea-mainnet.quiknode.pro` пропущены → утечка Hub RPC на реальную Linea | `anvil.fixture.ts:90 vs :861`                 | R2, R3  |
| 3   | ✅ **Перманентное кеширование null** в SW patch при сбое probe — одна транзитная ошибка навсегда перенаправляет запросы на реальный mainnet                                                | `anvil.fixture.ts:411-426`                    | R2      |
| 4   | ✅ **Хрупкие STX regex** привязаны к минифицированным именам MetaMask → сломаются при любом обновлении                                                                                     | `anvil.fixture.ts:459-592`                    | R2      |
| 5   | ✅ **Дублирование browser launch** — `anvil.fixture.ts` полностью пере-реализует запуск из `metamask.fixture.ts` (~40 строк)                                                               | `anvil.fixture.ts:656-729`                    | R1      |
| 6   | ✅ **Validation specs на 90% идентичны** — `weth-validation`, `snt-validation`, `linea-validation` дублируют код                                                                           | `tests/hub/pre-deposits/*-validation.spec.ts` | R1, R3  |
| 7   | ✅ **`METAMASK_VERSION` дублируется в 4 местах** — `.env.example`, `e2e.yml`, `download-metamask-extension.ts`, `env.ts`                                                                   | Multiple                                      | R4      |

### MEDIUM

| #   | Описание                                                                                                           | Файл                          | Ревьюер |
| --- | ------------------------------------------------------------------------------------------------------------------ | ----------------------------- | ------- |
| 8   | ✅ `rimraf` в скрипте `clean` но нет в devDependencies                                                                | `package.json:21`             | R4      |
| 9   | ✅ `typescript` нет в devDependencies (typecheck скрипт может не работать)                                            | `package.json`                | R4      |
| 10  | ✅ CI не запускает `lint`/`typecheck` для e2e                                                                         | `e2e.yml`                     | R1, R4  |
| 11  | ✅ Module-level state без runtime guard `workers > 1`                                                                 | `anvil.fixture.ts:434`        | R1      |
| 12  | ✅ "Dismiss MetaMask popups" повторяется в каждом anvil тесте                                                         | All deposit specs             | R1      |
| 13  | ✅ Fallback при revert не сбрасывает token balances                                                                   | `anvil.fixture.ts:803-818`    | R2      |
| 14  | ✅ Race condition — `page.evaluate()` patch ПОСЛЕ `page.goto()`, Hub может успеть отправить `wallet_addEthereumChain` | `anvil.fixture.ts:1043-1094`  | R2      |
| 15  | ✅ Mock `linea_estimateGas` с нереалистичными gas values (`baseFeePerGas: 7 wei`)                                     | `anvil.fixture.ts:77-84`      | R2      |
| 16  | ✅ `hasUnapprovedActivityEntry()` создаёт новую page на каждый вызов                                                  | `notification.page.ts:78-120` | R2      |
| 17  | ✅ 30+ hardcoded timeout magic numbers в `notification.page.ts`                                                       | `notification.page.ts`        | R4      |
| 18  | ✅ Apple Silicon Docker `linux/amd64` Rosetta — не задокументировано                                                  | `docker-compose.anvil.yml:6`  | R4      |
| 19  | ✅ Secrets (seed phrase) не задокументированы для CI                                                                  | `e2e.yml:90-91`               | R4      |
| 20  | ✅ `switchMetaMaskToChain()` — race если chain уже выбран (popup не появится, timeout)                                | `hub-test-helpers.ts:13-30`   | R2      |

### LOW / Quick-wins

| #   | Описание                                                                | Файл                                      | Ревьюер |
| --- | ----------------------------------------------------------------------- | ----------------------------------------- | ------- |
| 21  | ✅ **`settings.page.ts` использует semicolons** (style violation)          | `settings.page.ts`                        | R3      |
| 22  | ✅ **`MetaMaskSettingsPage` — dead code** (instantiated, never used)       | `settings.page.ts`, `metamask.page.ts:26` | R3      |
| 23  | ✅ **`MetaMaskHomePage` — dead code** (instantiated, never used)           | `home.page.ts`, `metamask.page.ts:25`     | R3      |
| 24  | ✅ **`requireAnvilMainnetRpc/LineaRpc`** — defined, never called           | `env.ts:78-97`                            | R3      |
| 25  | ✅ **`isAnvilConfigured()`** — defined, never called (always returns true) | `env.ts:72-75`                            | R3, R4  |
| 26  | ✅ **`fixtures/index.ts`** — barrel file, never imported                   | `fixtures/index.ts`                       | R3      |
| 27  | ✅ **Vault addresses** дублируются в `vaults.ts` и `anvil-rpc.ts`          | Two files                                 | R3      |
| 28  | ✅ `anvil.fixture.ts` 1100 строк — кандидат на split                       | `anvil.fixture.ts`                        | R3      |
| 29  | ✅ `no-explicit-any` выключен глобально для всего 3 usages                 | `eslint.config.mjs:25`                    | R3      |
| 30  | ✅ `VIEWPORT` в файле `timeouts.ts` — naming mismatch                      | `timeouts.ts:1-5`                         | R4      |
| 31  | ✅ PageObject instantiation в каждом тесте (можно вынести в fixtures)      | All specs                                 | R1, R3  |
| 32  | ✅ `STATUS_SEPOLIA_*` env fields — загружаются но не используются          | `env.ts`, `env.d.ts`                      | R3      |
| 33  | ✅ README не покрывает Anvil/Docker setup, архитектуру, debugging          | `README.md`                               | R4      |
| 34  | ✅ `call()/callWithRetry()` возвращают `Promise<any>`                      | `anvil-rpc.ts:571,631`                    | R3      |

---

## Рекомендуемый порядок исправлений

### Phase 1 — Quick wins (~30 min) ✅ DONE

- ✅ Fix #1: CI → `pnpm test:smoke` вместо `pnpm test`
- ✅ Fix #21-26, #32: Удалить dead code (`settings.page.ts`, `home.page.ts`, `fixtures/index.ts`, dead functions в `env.ts`, `STATUS_SEPOLIA_*` fields), прогнать Prettier
- ✅ Fix #8-9: Добавить `rimraf`, `typescript` в devDependencies

**Верификация Phase 1:**
- `pnpm lint` — PASS
- `pnpm typecheck` — PASS
- `pnpm test:smoke` — PASS (1 test, 3.7s)
- External review agent — 9/9 checks PASS

### Phase 2 — High-impact (1-2h) ✅ DONE

- ✅ Fix #2: Унифицировать hostname списки → `constants/rpc-hosts.ts`, интерполяция в SW patch
- ✅ Fix #3: `delete _c[url]` вместо `_c[url] = null` в catch при probe failure
- ✅ Fix #6: 3 validation spec'а → один параметризованный `below-minimum-validation.spec.ts`
- ✅ Fix #7: `METAMASK_VERSION` → `package.json` `config.metamaskVersion`, CI читает оттуда

**Верификация Phase 2:**
- `pnpm lint` — PASS
- `pnpm typecheck` — PASS
- `pnpm test` — 21/21 PASS (6.0 min)
- External review agent — 11/11 checks PASS

### Phase 3 — Structural (2-4h) ✅ DONE

- ✅ Fix #5: Рефакторить fixture hierarchy с `beforeLaunch` hook → `launchMetaMaskContext()` в `metamask.fixture.ts`
- ✅ Fix #28: Split `anvil.fixture.ts` → `service-worker-patch.ts`, `stx-patcher.ts`, `anvil.fixture.ts`
- ✅ Fix #10: Добавить lint/typecheck в CI → `e2e.yml` step before tests
- ✅ Fix #31: Page objects как fixtures → `preDepositsPage` + `depositModal` в anvil fixture

**Верификация Phase 3:**
- `pnpm lint` — PASS
- `pnpm typecheck` — PASS
- `pnpm test` — 21/21 PASS (6.0 min)
- External review agent — 1 issue found and fixed (afterClose in try/finally)

### Phase 4 — Code quality fixes ✅ DONE

- ✅ Fix #11: Runtime guard `workers > 1` → throw in `anvilRpc` fixture via `testInfo.config.workers`
- ✅ Fix #27: Deduplicate vault addresses → `TEST_VAULTS` imports from `CONTRACTS`
- ✅ Fix #29: Re-enable `no-explicit-any` ESLint rule → fixed all `any` usages
- ✅ Fix #34: Type `call()`/`callWithRetry()` with generics → `<T = unknown>`
- ✅ Fix #30: Move `VIEWPORT` out of `timeouts.ts` → `constants/viewport.ts`
- ✅ Fix #20: Handle `switchMetaMaskToChain` race → query `eth_chainId` before switch, early return if already on target chain
- ✅ Fix #15: Realistic `linea_estimateGas` mock values → `baseFeePerGas: 0x174876E800` (~100 gwei)

**Верификация Phase 4:**
- `pnpm lint` — PASS
- `pnpm typecheck` — PASS
- `pnpm test` — 21/21 PASS (5.9 min)
- External review agent — no issues found

### Phase 5 — HIGH severity remaining ✅ DONE

- ✅ Fix #5: Пометить как выполненное (реализовано в Phase 3 через `launchMetaMaskContext`)
- ✅ Fix #4: Рефакторинг STX patcher — замена hardcoded chunk filenames динамическим сканированием всех `.js` файлов. Паттерны вынесены в `StxPatchPattern[]` массив. Добавлена диагностика: warning при 0 совпадений. SW fetch interceptor остаётся полным fallback.

**Верификация Phase 5:**
- `pnpm lint` — PASS
- `pnpm typecheck` — PASS
- `pnpm test` — 21/21 PASS (6.1 min)
- External review agent — no bugs found, all patterns preserved, transform/reverse inverses verified

### Phase 6 — MEDIUM severity remaining ✅ DONE

- ✅ Fix #14: Заменить `page.evaluate()` на `page.addInitScript()` для блокировки `wallet_addEthereumChain` — устраняет race condition между `page.goto()` и provider patch. Используется polling pattern (10ms) для перехвата `window.ethereum` сразу при инъекции MetaMask.
- ✅ Fix #12: Удалить дублирующиеся `dismissPendingAddNetwork()` из тестовых спеков — fixture обрабатывает через `addInitScript` + пост-коннект dismiss.
- ✅ Fix #13: Сброс балансов токенов (WETH, LINEA, USDT, USDC, USDS) в fallback при неудачном revert. SNT исключён — MiniMeToken не позволяет обнулить баланс через storage slot.
- ✅ Fix #16: Кеширование MetaMask home page через `getOrCreateHomePage()` — избегает создания/закрытия временных страниц при каждом вызове `hasUnapprovedActivityEntry()`.
- ✅ Fix #17: Вынос всех inline timeout magic numbers в именованные константы `NOTIFICATION_TIMEOUTS` (DOM_SETTLE, SHORT_SETTLE, PAGE_REOPEN, POST_CLICK, CONTENT_CHECK, POLL_INTERVAL). Все 30+ raw значений в `notification.page.ts` заменены.

**Верификация Phase 6:**
- `pnpm lint` — PASS
- `pnpm typecheck` — PASS
- `pnpm test` — 21/21 PASS (5.6 min)
- External review agent — no bugs found, all replacements verified complete

### Phase 7 — Documentation (LOW + remaining MEDIUM) ✅ DONE

- ✅ Fix #18: Документация Apple Silicon Docker Rosetta — добавлены инструкции по включению Rosetta и `DOCKER_PLATFORM` override.
- ✅ Fix #19: Документация CI secrets — добавлена таблица с `E2E_WALLET_SEED_PHRASE` и `E2E_WALLET_PASSWORD`, инструкция по настройке в GitHub Settings.
- ✅ Fix #33: Расширен README — добавлены секции: Architecture, Project Structure, Fixture Hierarchy, How Anvil Tests Work, Anvil/Docker Setup, CI Setup, Debugging, Common Issues, Adding a New Vault.

**Верификация Phase 7:**
- `pnpm lint` — PASS
- `pnpm typecheck` — PASS
- Документационные изменения — тесты не затронуты

### Верификация после исправлений

```bash
cd e2e
pnpm lint
pnpm typecheck
pnpm test:smoke
# Если Anvil доступен:
pnpm test:anvil
```

---

## Ревьюер 1: Playwright-архитектура и тест-дизайн

### 1. Fixture Hierarchy

#### 1.1 Duplicated Browser Launch Logic

**Severity: High**

`anvil.fixture.ts` overrides `extensionContext` (lines 656-729) and completely re-implements the browser launch logic from `metamask.fixture.ts` (lines 19-46). Both contain nearly identical code:

- `fs.existsSync(extensionPath)` check
- `fs.mkdtempSync(path.join(os.tmpdir(), 'pw-metamask-'))`
- `chromium.launchPersistentContext(profileDir, { ... })` with the same extension args
- cleanup: `context.close()` + `fs.rmSync(profileDir, ...)`

The anvil fixture adds three extra Chrome flags and pre-launch file patching. The comment on line 657-659 acknowledges this:

> The parent fixture (metamask.fixture) launches the browser with MetaMask loaded, but we need to modify the extension files BEFORE the browser reads them. This requires duplicating the browser launch logic.

**Recommendation:** Refactor `metamask.fixture.ts` to accept a `beforeLaunch` hook:

```typescript
interface MetaMaskFixtureOptions {
  beforeLaunch?: (extensionPath: string) => void | Promise<void>
  afterClose?: () => void | Promise<void>
  extraChromeArgs?: string[]
}

export function createMetaMaskFixture(options: MetaMaskFixtureOptions = {}) {
  return base.extend<MetaMaskFixtures>({
    extensionContext: async ({}, use) => {
      const env = loadEnvConfig()
      const extensionPath = env.METAMASK_EXTENSION_PATH
      await options.beforeLaunch?.(extensionPath)
      const context = await chromium.launchPersistentContext(profileDir, {
        args: [
          `--disable-extensions-except=${extensionPath}`,
          `--load-extension=${extensionPath}`,
          ...(options.extraChromeArgs ?? []),
        ],
        viewport: { width: VIEWPORT.WIDTH, height: VIEWPORT.HEIGHT },
      })
      await use(context)
      await context.close()
      fs.rmSync(profileDir, { recursive: true, force: true })
      await options.afterClose?.()
    },
  })
}
```

#### 1.2 Anvil Fixture Bypasses `wallet-connected` Overrides

**Severity: Medium**

`anvil.fixture.ts` extends `walletTest` from `wallet-connected.fixture.ts`, but overrides both `extensionContext`, `metamask`, and `hubPage` — effectively bypassing most of `wallet-connected.fixture`'s logic.

**Recommendation:** Consider having `anvil.fixture` extend `metamask.fixture` directly since it overrides all the fixtures that `wallet-connected` adds.

#### 1.3 Module-Level State Without Runtime Guard

**Severity: Medium** | Lines 434-441 of `anvil.fixture.ts`

Module-level variables (`baseSnapshots`, `originalSwContent`, `swFilePath`, `stxPatchedFiles`) are safe only because `workers: 1`.

**Recommendation:** Add a runtime guard:

```typescript
if (test.info().config.workers !== 1) {
  throw new Error(
    'anvil.fixture requires workers: 1 (module-level snapshot state)',
  )
}
```

### 2. Test Duplication

#### 2.1 Validation Specs ~90% Identical

**Severity: High**

Three spec files share near-identical structure:

| File                       | Vault | Error Pattern                           |
| -------------------------- | ----- | --------------------------------------- |
| `weth-validation.spec.ts`  | WETH  | `/below minimum deposit\. min: 0\.00/i` |
| `snt-validation.spec.ts`   | SNT   | `/below minimum deposit\. min: 1/i`     |
| `linea-validation.spec.ts` | LINEA | `/below minimum deposit\. min: 1/i`     |

Differences: vault name, funding preset, amount constant, error regex. LINEA checks `switchNetworkButton` instead of `actionButton`.

**Recommendation:** Consolidate into a single parameterized spec (like `gusd-deposit.spec.ts` already does):

```typescript
const BELOW_MIN_TESTS = [
  {
    vault: 'WETH',
    preset: 'WETH_BELOW_MIN',
    amount: BELOW_MIN_AMOUNTS.WETH,
    errorPattern: /below minimum deposit\. min: 0\.00/i,
  },
  {
    vault: 'SNT',
    preset: 'SNT_BELOW_MIN',
    amount: BELOW_MIN_AMOUNTS.SNT,
    errorPattern: /below minimum deposit\. min: 1/i,
  },
  {
    vault: 'LINEA',
    preset: 'LINEA_BELOW_MIN',
    amount: BELOW_MIN_AMOUNTS.LINEA,
    errorPattern: /below minimum deposit\. min: 1/i,
  },
] as const

for (const tc of BELOW_MIN_TESTS) {
  test(
    `${tc.vault}: shows below minimum error`,
    { tag: '@anvil' },
    async ({ hubPage, anvilRpc }) => {
      /* shared body */
    },
  )
}
```

This reduces ~150 lines to ~50.

#### 2.2 Deposit Spec Structural Repetition

**Severity: Medium**

Deposit specs share a common flow: fund → navigate → dismiss popups → open modal → enter amount → approve → confirm → verify. WETH and LINEA have unique variations.

**Recommendation:** Extract a `depositFlowHelper` with hooks for vault-specific behavior.

### 3. Page Object Instantiation

**Severity: Low**

Every anvil test creates `new PreDepositsPage(hubPage)` and `new PreDepositModalComponent(hubPage)` inline.

**Recommendation:** Add as fixtures in `anvil.fixture.ts`:

```typescript
preDepositsPage: async ({ hubPage }, use) => {
  await use(new PreDepositsPage(hubPage))
},
depositModal: async ({ hubPage }, use) => {
  await use(new PreDepositModalComponent(hubPage))
},
```

Playwright fixtures are lazy-evaluated, so unused fixtures are not instantiated.

### 4. Repeated Setup Steps

#### 4.1 "Dismiss MetaMask Popups" in Every Test

**Severity: Medium**

`await metamask.dismissPendingAddNetwork()` appears in every deposit test. The fixture-level dismissal (line 1093) is insufficient because popups reappear after navigation.

**Recommendation:** Move dismissal into `PreDepositsPage.goto()` or a fixture-level `afterEach` hook.

#### 4.2 `goto()` + `waitForReady()` Instead of `navigateAndWait()`

**Severity: Low**

`BasePage.navigateAndWait()` (line 13-16) does exactly this but is never used. Tests should use `await preDepositsPage.navigateAndWait()`.

### 5. Config Review

#### 5.1 `smoke` vs `wallet/anvil` Device Config

**Severity: Low**

`smoke` uses `devices['Desktop Chrome']`; wallet/anvil don't (they use persistent context with custom viewport). This is intentional — add a comment explaining.

#### 5.2 `workers: 1` and `fullyParallel: false` Undocumented

**Severity: Low**

**Recommendation:** Add comments:

```typescript
// workers: 1 — required because:
// 1. MetaMask extension files are patched on disk — concurrent writes would conflict
// 2. Anvil fork state (snapshot/revert) is shared across tests
// 3. Module-level snapshot cache assumes single-worker
workers: 1,
```

### 6. CI Pipeline

#### 6.1 `pnpm test` Includes @anvil Without Anvil in CI

**Severity: Critical**

CI runs `pnpm test` = `playwright test` = ALL projects. Anvil is never started. Tests will fail with connection errors × 3 retries each.

**Recommendation:**

```yaml
run: cd e2e && xvfb-run --auto-servernum -- pnpm test:smoke
```

#### 6.2 No Lint/Typecheck in CI

**Severity: Medium**

Add:

```yaml
- name: Lint and typecheck E2E
  run: cd e2e && pnpm lint && pnpm typecheck
```

### 7. Extensibility

Adding a new vault requires:

1. `constants/hub/vaults.ts` — add to `TEST_VAULTS`, `BELOW_MIN_AMOUNTS`, `DEPOSIT_AMOUNTS`
2. `helpers/anvil-rpc.ts` — add contract address, funding method, `FUNDING_PRESETS` entry
3. `helpers/anvil-rpc.ts` — add to `enableAllVaults()`
4. Create spec files

The pattern is clear but not documented. **Recommendation:** Add a section to README.

---

## Ревьюер 2: Web3/MetaMask автоматизация

### 1. Service Worker Fetch Patch

#### 1.1 Host List Divergence Between SW Patch and Context Route

**Severity: High**

SW patch `_lineaHosts` (line 90):

```js
;[
  'rpc.linea.build',
  'linea-mainnet.infura.io',
  'linea.drpc.org',
  'linea-mainnet.quiknode.pro',
]
```

Context route `KNOWN_LINEA_HOSTS` (line 861):

```ts
;['rpc.linea.build', 'linea-mainnet.infura.io']
```

`linea.drpc.org` and `linea-mainnet.quiknode.pro` are missing from the context route. If the Hub's wagmi transport uses these providers, page-level RPC calls will hit real Linea.

**Fix:** Unify into a single shared constant. Interpolate into the SW patch template string.

#### 1.2 Missing RPC Providers

**Severity: Medium**

MetaMask v13.18.1 can use additional providers not in lists (`eth-mainnet.blastapi.io`, `gateway.tenderly.co`, `eth.llamarpc.com`, `linea.blockpi.network`). Unrecognized hosts fall to the `eth_chainId` probe, which is less reliable.

**Fix:** Audit MetaMask v13.18.1's `@metamask/network-controller` for full provider list.

#### 1.3 Hardcoded `linea_estimateGas` Mock Values

**Severity: Medium** | Lines 77-84

- `baseFeePerGas: "0x7"` = 7 wei — extremely low (real Linea: ~100 gwei)
- `priorityFeePerGas: "0x3b9aca00"` = 1 gwei — reasonable
- `gasLimit: "0x7A120"` = 500,000 — reasonable

Low direct risk since Anvil auto-mines, but could cause issues if auto-mine is ever disabled.

**Fix:** Use more realistic values (e.g., `baseFeePerGas: "0x174876E800"` / ~100 gwei).

#### 1.4 `_fakeUuid` Uses `Date.now()` — Collision Risk

**Severity: Low** | Line 249

Extremely low risk — only possible if service worker restarts at the exact same millisecond as an STX submission.

#### 1.5 URL Cache `_c` Grows Unbounded

**Severity: Low**

Negligible for test runs. MetaMask tests run in isolated browser profiles with bounded lifetime.

#### 1.6 `_fwdReceiptWithFallback` — Response Body Handling

**Severity: Low (no issue)**

The logic is correctly implemented — consistent use of `response.clone()` prevents body consumption issues.

#### 1.7 Permanent Null Caching on Probe Failure

**Severity: High** | Lines 411-426

If probe fails (timeout, DNS error), `_c[url]` is permanently set to `null`. All future requests bypass Anvil. Unlike the context route (which rebuilds cache per-test), the SW patch cache persists for the entire browser session.

**Fix:** Don't cache `null` for probe failures (retry on next request), or add retry logic to the probe.

### 2. Smart Transaction File Patching

#### 2.1 Brittle Regex Patterns

**Severity: High** | Lines 459-592

Regex patterns reference specific minified file names and code patterns. Any change in MetaMask's minification will break them silently. The SW fetch patch provides defense-in-depth (STX API interception), but the file patching is the primary mechanism.

**Fix:**

1. Pin MetaMask to exact version (already done: `13.18.1`)
2. Add a CI check verifying all regex patterns match at least once
3. Document that MetaMask updates require re-auditing patterns

#### 2.2 Crash Recovery — Stale Patches

**Severity: Medium** | Lines 647-653, 724-728

Idempotency logic (reverse → forward transform) handles crash recovery correctly. The SW patch stripping relies on `})();\n` delimiter, which is fragile but works for current format.

**Fix:** Use `PATCH_MARKER` as delimiter for more precise boundary detection.

#### 2.3 Reverse Transform Precision

**Severity: Low**

Only matters if MetaMask is updated without updating patterns. Acceptable since version is pinned.

### 3. Context-Level RPC Routing

#### 3.1 Permanent Null Caching on Probe Failure

**Severity: Medium** | Lines 946-977

Same issue as SW patch but mitigated: retries once (2 attempts), and `rpcRedirectCache` is scoped per-test (resets between tests).

**Fix:** Consider 3 retries, or don't cache null.

#### 3.2 Race Window Before Provider Patch

**Severity: Medium** | Lines 1043-1094

The code navigates to Hub URL, waits for `domcontentloaded`, THEN patches `window.ethereum.request`. Between navigation and `page.evaluate()`, the Hub may already fire `wallet_addEthereumChain`. Current mitigation: `dismissPendingAddNetwork()` after patching.

**Fix:** Use `page.addInitScript()` before `page.goto()` to eliminate the race entirely.

#### 3.3 `linea_*` Methods Inconsistency

**Severity: Low (intentional)**

Context route passes ALL `linea_*` through; SW patch mocks `linea_estimateGas` only. This is correct: Hub doesn't use `linea_estimateGas`, MetaMask does.

### 4. AnvilRpcHelper Correctness

#### 4.1 `fundSnt()` Controller Funding

**Severity: Low** | Lines 238-275

1 ETH for the SNT controller is vastly more than needed but harmless in test environment.

#### 4.2 `findErc20BalanceSlot()` Coverage

**Severity: Medium** | Lines 328-367

Candidate slots 0-10 plus OZ_V5 cover all currently used tokens (WETH slot 3, USDT slot 2, USDC slot 9). Will fail loudly if a new token uses an uncovered layout.

**Fix:** Consider adding slots 11-20 for future-proofing.

#### 4.3 Sequential `fund()` Execution

**Severity: Low** | Lines 463-485

Operations on different forks could be parallelized. Adds ~200-500ms per token.

**Fix:** `Promise.all()` for cross-fork operations.

#### 4.4 `resetAllowance()` — Correct for USDT

**Severity: Low (no issue)**

Sets allowance to 0 before the test initiates approve — correct approach.

#### 4.5 `callWithRetry` Configuration

**Severity: Low (no issue)**

5 retries × 200ms for local Anvil is reasonable. Only retries `TransientRpcError` (network errors), not semantic errors. Well-designed.

### 5. Snapshot/Revert Pattern

#### 5.1 Module-Level `baseSnapshots`

**Severity: Low**

Safe with `workers: 1`. Would break silently with `workers > 1`. Add runtime guard (see R1 §1.3).

#### 5.2 Fallback When Revert Fails

**Severity: Medium** | Lines 803-818

Fallback re-establishes ETH balances and enables vaults but does NOT reset token balances from the previous test.

**Fix:** In fallback, also zero out known token balances:

```typescript
await Promise.all([
  helper.fundErc20ViaStorage(CONTRACTS.WETH, 0n, helper.mainnetRpc),
  helper.fundErc20ViaStorage(CONTRACTS.USDT, 0n, helper.mainnetRpc),
])
```

#### 5.3 Re-snapshot After Revert

**Severity: Low (no issue)**

Standard Anvil pattern. `evm_revert` consumes snapshot; `evm_snapshot` immediately after captures clean state. Reliable.

### 6. NotificationPage Robustness

#### 6.1 `approveTransaction()` Complexity

**Severity: Medium** | Lines 253-351

Complex retry loop with multiple exit conditions. All paths eventually succeed or throw. But in pathological cases, could loop for the full `contentTimeout` (45s) opening/closing pages.

**Fix:** Add max-attempts counter (not just timeout) to prevent degenerate loops.

#### 6.2 `hasUnapprovedActivityEntry()` Page Creation Overhead

**Severity: Medium** | Lines 78-120

Each call may create a new home.html page, load MetaMask UI, navigate to Activity tab, query DOM, then close the page. Called multiple times per `approveTransaction()`.

**Fix:** Keep a persistent MetaMask home page for the duration of the method.

#### 6.3 `clearAddNetworkQueue()` Mixed Request Types

**Severity: Medium** | Lines 426-484

Method detects "Add Network" pages. Non-network requests cause early return, which could return the wrong page type to the caller.

**Fix:** Also verify the current page IS a transaction confirmation before returning.

#### 6.4 `approveTokenSpend()` Reliability

**Severity: Low** | Lines 64-71

500ms timeout for `isSpendingCapConfirmation` is short but adequate since spending cap text appears in initial render.

#### 6.5 Undocumented `waitForTimeout()` Values

**Severity: Low**

15 `waitForTimeout()` calls throughout. Most have inline comments explaining rationale. All are justified by MetaMask's MV3 service worker architecture creating asynchronous gaps.

**Fix:** Extract frequently-used delays into named constants in `timeouts.ts`.

### 7. MetaMask Interaction Patterns

#### 7.1 `connectToDApp()` Assumptions

**Severity: Low** | `metamask.page.ts:51-60`

Assumes Hub has "Connect" button → "MetaMask" option. Inherent to E2E testing.

#### 7.2 `dismissPendingAddNetwork()` — "Reject All"

**Severity: Medium**

"Reject All" clears the ENTIRE MetaMask queue, not just network requests. Safe as currently used (called before transactions), dangerous if called at wrong time.

#### 7.3 `switchMetaMaskToChain()` Race

**Severity: Medium** | `hub-test-helpers.ts:13-30`

If chain is already selected, no popup appears → `switchNetwork()` times out.

**Fix:** Check current chain first, or try-catch around `switchNetwork()` with verification.

---

## Ревьюер 3: TypeScript качество кода

### 1. Dead Code

#### 1.1 `MetaMaskSettingsPage` — Never Used

**Priority: P1 | Effort: S**

Instantiated in `metamask.page.ts` (line 26) but `.settings` is never called anywhere.

**Fix:** Remove from `metamask.page.ts`. Delete `settings.page.ts`.

#### 1.2 `requireAnvilMainnetRpc()` / `requireAnvilLineaRpc()` — Never Called

**Priority: P1 | Effort: S**

Exported from `env.ts` (lines 78-97) but never imported anywhere.

**Fix:** Remove both functions.

#### 1.3 `isAnvilConfigured()` — Never Called

**Priority: P1 | Effort: S**

Defined at `env.ts` line 72. Always returns `true` (fallback URLs are always set).

**Fix:** Remove.

#### 1.4 `MetaMaskHomePage` — Never Used in Tests

**Priority: P2 | Effort: S**

Instantiated in `metamask.page.ts` (line 25) but `.home.` never called. `hasUnapprovedActivityEntry()` opens home.html directly without `MetaMaskHomePage`.

**Fix:** Remove, or keep with a `// TODO` comment if future tests will use it.

#### 1.5 Unused `MetaMaskPage` Methods

**Priority: P2 | Effort: S**

`rejectTransaction()`, `signMessage()`, `getExtensionPage()` — never called from tests.

**Fix:** Keep as API surface for future tests. Add `/** Future use */` JSDoc.

#### 1.6 `BasePage` Methods Never Called

**Priority: P2 | Effort: S**

`getTitle()`, `scrollIntoView()`, `navigateAndWait()` — defined but never used.

#### 1.7 `fixtures/index.ts` — Never Imported

**Priority: P2 | Effort: S**

Barrel file exports `anvilTest`, `baseTest`, `walletTest`, `metamaskTest`. Tests import directly from fixture files.

**Fix:** Remove `index.ts` or update tests to use it.

#### 1.8 `STATUS_SEPOLIA_*` — Loaded But Never Read

**Priority: P3 | Effort: S**

Fields in `E2EEnvConfig` populated in `loadEnvConfig()` but never accessed. `STATUS_SEPOLIA_CHAIN_ID_HEX` in `chains.ts` is hardcoded independently.

### 2. Type Safety

#### 2.1 `call()/callWithRetry()` Return `Promise<any>`

**Priority: P1 | Effort: M** | `anvil-rpc.ts:571,631`

**Fix:**

```typescript
private async call<T = unknown>(rpc: string, method: string, params: unknown[]): Promise<T> {
  return json.result as T
}

async snapshot(rpc?: string): Promise<string> {
  return this.call<string>(rpc ?? this.mainnetRpc, 'evm_snapshot', [])
}
```

#### 2.2 `json: any`

**Priority: P2 | Effort: S** | `anvil-rpc.ts:601`

**Fix:** Type as `{ result?: unknown; error?: { message?: string } }`.

#### 2.3 `(window as any).ethereum` Inconsistent Typing

**Priority: P2 | Effort: S**

`anvil.fixture.ts` already demonstrates proper typing. `hub-test-helpers.ts` and `settings.page.ts` use `(window as any).ethereum`.

**Fix:** Extract shared `EthereumProvider` interface.

#### 2.4 `no-explicit-any` Disabled Globally

**Priority: P1 | Effort: M** | `eslint.config.mjs:25`

Only 3 actual `any` usages in `src/` — all in `anvil-rpc.ts`. Global disable masks future `any` creep.

**Fix:** Re-enable the rule. Add targeted `eslint-disable-next-line` on the 3 spots (or fix them with generics).

### 3. Hostname List Duplication

**Priority: P1 | Effort: M**

SW patch has 4 Linea hosts; context route has 2. See R2 §1.1 for details.

**Fix:** Extract to `constants/rpc-hosts.ts`, interpolate into SW patch string:

```typescript
const LINEA_HOSTS = [
  'rpc.linea.build',
  'linea-mainnet.infura.io',
  'linea.drpc.org',
  'linea-mainnet.quiknode.pro',
] as const

// In buildServiceWorkerPatch():
;`var _lineaHosts = [${LINEA_HOSTS.map(h => `'${h}'`).join(',')}];`

// In hubPage fixture:
const KNOWN_LINEA_HOSTS = LINEA_HOSTS
```

### 4. File Size and Organization

#### 4.1 `anvil.fixture.ts` — 1100 Lines

**Priority: P2 | Effort: L**

Three distinct responsibilities:

1. Service worker patch (lines 51-429)
2. STX patching (lines 440-653)
3. Fixture definitions (lines 655-1100)

**Suggested split:**

- `src/helpers/service-worker-patch.ts`
- `src/helpers/stx-patcher.ts`
- `src/fixtures/anvil.fixture.ts` (only fixture definitions)

#### 4.2 `anvil-rpc.ts` — 707 Lines

**Priority: P3** — Well-structured with clear section headers. Acceptable.

#### 4.3 `notification.page.ts` — 591 Lines

**Priority: P3** — Manageable. No strong case for splitting now.

### 5. Style Consistency

#### 5.1 `settings.page.ts` Uses Semicolons

**Priority: P0 | Effort: S**

Entire project uses `semi: false`. This file uses semicolons on every line.

**Fix:** `npx prettier --write e2e/src/pages/metamask/settings.page.ts`

#### 5.4 `eslint-disable` Audit

Only 2 comments exist:

1. `anvil.fixture.ts:831` — `no-unused-vars` for Playwright fixture dependency. **Justified.**
2. `settings.page.ts:94` — `no-explicit-any`. **Redundant** (rule already globally disabled).

### 6. Naming Conventions

#### 6.1 SW Patch Variables Undocumented

**Priority: P2 | Effort: S**

`_f`, `_R`, `_c`, `_m`, `_tx` — intentionally short (LavaMoat collision risk).

**Fix:** Add comment:

```javascript
// Short names minimize collision with MetaMask's minified code
// _f=fetch, _R=Response, _c=urlCache, _m=chainMap, _tx=txHashMap
```

#### 6.4 Vault Addresses Duplicated

**Priority: P1 | Effort: S**

Addresses in both `anvil-rpc.ts:24-27` (`CONTRACTS`) and `vaults.ts:10-31` (`TEST_VAULTS`).

**Fix:** Have `TEST_VAULTS` reference `CONTRACTS`.

### 7. Code Duplication in Tests

#### 7.1-7.2 Identical Imports and Page Object Instantiation

**Priority: P2 | Effort: M**

6 spec files share identical import blocks and instantiation. Fix via fixtures (see R1 §3).

### 8. `waitForTimeout()` Audit

**15 total occurrences:**

- **11 in `notification.page.ts`** — All justified (MetaMask MV3 service worker architecture timing)
- **2 in `weth-deposit.spec.ts`** (lines 50, 161) — **Potentially improvable:** could use `expect.poll()` instead of fixed 1500ms delay
- **1 in `settings.page.ts`** — Dead code (file unused)
- **1 in `settings.page.ts`** — Dead code

**Fix for test-level waits:**

```typescript
// Instead of: await hubPage.waitForTimeout(1_500)
await expect
  .poll(
    async () => {
      const balance = await anvilRpc.getErc20Balance(CONTRACTS.WETH)
      return balance > 0n
    },
    { timeout: 5_000 },
  )
  .toBeTruthy()
```

---

## Ревьюер 4: Инфраструктура и DevEx

### 1. Docker Configuration

#### 1.1 Image Pinning

**Severity: Low**

`ghcr.io/foundry-rs/foundry:v1.4.0` — properly pinned. Not pinned by digest but low-risk.

#### 1.2 Apple Silicon / Rosetta Not Documented

**Severity: Medium**

Default `linux/amd64` requires Rosetta on Apple Silicon. `DOCKER_PLATFORM` override exists but README doesn't mention it.

#### 1.3 `--silent` Without Verbose Mode

**Severity: Low**

Makes debugging fork failures difficult. Consider `ANVIL_VERBOSE` env var.

#### 1.4 Healthcheck Timing

**Severity: Low**

`start_period: 5s` + `interval: 2s` + `retries: 15` = ~35s max. Sufficient for public RPCs.

### 2. CI/CD Pipeline

#### 2.1 `pnpm test` Includes @anvil Without Anvil

**Severity: Critical** — See R1 §6.1.

#### 2.2 CI Timeout Adequacy

**Severity: Medium**

15 min timeout fine for smoke-only; risky if wallet tests included.

#### 2.3 Missing Lint/Typecheck

**Severity: Medium** — See R1 §6.2.

#### 2.4 Secrets Documentation

**Severity: Medium**

No docs about `E2E_WALLET_SEED_PHRASE` / `E2E_WALLET_PASSWORD` setup in GitHub Secrets.

#### 2.5 `pnpm install --frozen-lockfile`

**Severity: Low (correct)**

`e2e` IS in `pnpm-workspace.yaml` (line 18), root lockfile covers it.

#### 2.6 `deployment_status` Filter

**Severity: Low**

`contains(target_url, 'status-network-hub')` — specific enough but fragile if Vercel naming changes.

#### 2.7 No `pull_request` Trigger

**Severity: Medium**

E2E tests don't run on PRs. Breaking changes can merge without E2E validation. Partially covered by `deployment_status` (Vercel previews).

#### 2.8 Missing Path Triggers

**Severity: Low**

Missing `pnpm-lock.yaml` and `.github/workflows/e2e.yml` from path triggers.

### 3. Dependencies

#### 3.1 No Separate Lock File

**Severity: Low (correct)**

`e2e` is in workspace; root lockfile handles deps deterministically.

**Note:** README and CLAUDE.md incorrectly state e2e is "not part of monorepo workspaces."

#### 3.2 Caret Range for Playwright

**Severity: Medium**

`"@playwright/test": "^1.50.0"` — Playwright can break on minor updates. Consider `"~1.50.0"` or exact pin.

#### 3.3 `workspace:*` Protocol

**Severity: Low (correct)**

Works because `e2e` is in workspace.

#### 3.4 `rimraf` Not in Dependencies

**Severity: High**

`clean` script uses `rimraf` but it's not in `devDependencies`. `pnpm clean` will fail.

**Fix:** Add `"rimraf": "^5.0.0"` to devDependencies.

#### 3.5 `typescript` Not in Dependencies

**Severity: Medium**

`typecheck` runs `tsc --noEmit` but `typescript` not in devDependencies. Resolves from hoisted deps (fragile).

**Fix:** Add explicitly.

### 4. Environment Configuration

#### 4.1 `METAMASK_VERSION` in 4 Places

**Severity: High**

Hardcoded in `.env.example`, `e2e.yml`, `download-metamask-extension.ts`, `env.ts`.

**Fix:** Single source of truth. Remove fallback defaults. Require env var to be set.

#### 4.2 `loadEnvConfig()` Caching

**Severity: Low (correct)**

Module-level caching safe with `workers: 1`.

#### 4.3 `.env` Loading Order

**Severity: Low (correct)**

`.env.local` loaded first → takes precedence. Consistent between `env.ts` and `playwright.config.ts`.

#### 4.4 `WALLET_ADDRESS` Derivation

**Severity: Low (correct)**

`mnemonicToAccount` uses `m/44'/60'/0'/0/0` — matches MetaMask's default first account.

#### 4.5 `isAnvilConfigured()` Always Returns `true`

**Severity: Medium**

Fallback URLs mean it never returns `false`. Misleading and unused.

### 5. Documentation

#### 5.1 README is Minimal

**Severity: Medium**

Missing: architecture overview, Docker/Anvil setup, Apple Silicon notes, debugging tips, adding new tests, env var reference, CI behavior, project structure.

#### 5.2 Wrong Workspace Status

**Severity: Low**

CLAUDE.md says e2e is "not part of monorepo workspaces" but `pnpm-workspace.yaml` includes it.

### 6. Timeout Configuration

#### 6.1 Extensive Hardcoded Timeouts

**Severity: Medium**

30+ hardcoded timeout values in `notification.page.ts` that don't reference `timeouts.ts` constants.

#### 6.2 `VIEWPORT` in `timeouts.ts`

**Severity: Low**

Naming mismatch. Should be in its own file or rename `timeouts.ts` to `constants.ts`.

### 7. `.gitignore`

**Severity: Low (adequate)**

Root `.gitignore` handles `.env`, `node_modules/`. E2E `.gitignore` covers test artifacts and extensions.

### 8. Global Setup/Teardown

#### 8.1 Missing Validations in Global Setup

**Severity: Medium**

Missing: `BASE_URL` reachability check, Playwright browser check, Anvil health check. Warnings don't prevent test execution.

#### 8.2 Global Teardown

**Severity: Low**

Cleans up temp browser profiles. Adequate.

#### 8.3 `unzip` System Dependency

**Severity: Low**

Works on macOS/Linux. On CI, `playwright install --with-deps` provides it. No Windows support.
