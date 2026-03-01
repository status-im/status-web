# E2E Tests

Playwright + TypeScript E2E tests for [Status Network Hub](https://hub.status.network).

**Supported platforms:** macOS, Linux. Windows is supported only via [WSL2](https://learn.microsoft.com/en-us/windows/wsl/install) — run all commands inside a WSL2 distro (Ubuntu recommended). Native Windows is not supported because the test suite relies on Chromium extension loading, POSIX paths, and Docker `linux/amd64` images.

## Quick Start

```bash
cd e2e
pnpm install
npx playwright install chromium

# Configure environment
cp .env.example .env
# Edit .env — set WALLET_SEED_PHRASE for wallet tests (use a test-only wallet!)

# (Optional) Download MetaMask extension for wallet tests
pnpm setup:metamask

# Run smoke tests
pnpm test:smoke
```

## Commands

```bash
pnpm test              # All tests
pnpm test:smoke        # Smoke tests (@smoke tag, headless)
pnpm test:wallet       # Wallet tests (@wallet tag, headed + MetaMask)
pnpm test:anvil        # Anvil deposit tests (starts Docker, runs tests, stops)
pnpm anvil:up          # Start Anvil Docker forks only
pnpm anvil:down        # Stop Anvil Docker forks
pnpm test:headed       # All tests with visible browser
pnpm test:debug        # Step-by-step debug mode
pnpm test:ui           # Interactive Playwright UI
pnpm test:report       # Open last HTML report
pnpm lint              # TypeScript type check
pnpm clean             # Remove test artifacts and extensions
```

Run a specific file:

```bash
npx playwright test tests/pre-deposits/pre-deposits-display.spec.ts
```

## Tags

Tests use Playwright tags (`@smoke`, `@wallet`, `@anvil`) mapped to projects in `playwright.config.ts`:

```ts
test('my test', { tag: '@smoke' }, async ({ page }) => {
  // ...
})
```

| Tag | Project | Description |
|-----|---------|-------------|
| `@smoke` | `smoke` | Basic page-level checks, no wallet needed |
| `@wallet` | `wallet-flows` | MetaMask wallet interactions (connect, switch network) |
| `@anvil` | `anvil-deposits` | Full deposit flows against local Anvil forks |

## Architecture

### Project Structure

```
e2e/
├── src/
│   ├── constants/         # Timeout, viewport, RPC host, vault constants
│   ├── fixtures/          # Playwright fixture hierarchy
│   │   ├── base.fixture.ts           # Base fixture (shared config)
│   │   ├── metamask.fixture.ts       # MetaMask browser launch
│   │   ├── wallet-connected.fixture.ts  # Wallet connection flow
│   │   └── anvil.fixture.ts          # Anvil fork + deposit fixtures
│   ├── helpers/
│   │   ├── anvil-rpc.ts              # AnvilRpcHelper (fund, snapshot, revert)
│   │   ├── service-worker-patch.ts   # MetaMask SW fetch interceptor
│   │   ├── stx-patcher.ts           # Smart Transactions disabler
│   │   └── hub-test-helpers.ts       # Hub page interaction utilities
│   ├── pages/             # Page Object Models
│   │   ├── hub/           # Hub app pages (pre-deposits, deposit modal)
│   │   └── metamask/      # MetaMask pages (onboarding, notification)
│   └── config/
│       └── env.ts         # Environment config loader
├── tests/
│   ├── hub/pre-deposits/  # Pre-deposit test specs
│   └── metamask/          # MetaMask extension tests
├── playwright.config.ts
├── docker-compose.anvil.yml
└── .env.example
```

### Fixture Hierarchy

```
base.fixture (shared config, env)
  └── metamask.fixture (browser launch with MetaMask extension)
        └── wallet-connected.fixture (dApp connection, hub page)
              └── anvil.fixture (Anvil forks, SW patching, STX disable,
                                 snapshot/revert, page objects)
```

The anvil fixture:
1. Patches MetaMask's service worker to redirect RPC calls to local Anvil forks
2. Disables Smart Transactions (STX) via file patching + SW fetch interception
3. Manages Anvil snapshot/revert for test isolation
4. Provides `anvilRpc`, `preDepositsPage`, `depositModal` fixtures

### How Anvil Tests Work

Anvil tests run against local Ethereum/Linea forks (via [Foundry Anvil](https://book.getfoundry.sh/anvil/)):

1. **Docker starts two Anvil instances** — mainnet fork (port 8547) and Linea fork (port 8546)
2. **MetaMask SW is patched** — a fetch interceptor redirects RPC calls from real networks to local Anvil
3. **STX is disabled** — Smart Transactions are patched out to prevent MetaMask from using its own tx submission pipeline
4. **Each test**: fund wallet → navigate → deposit → verify, with snapshot/revert between tests

Tests run with `workers: 1` because:
- MetaMask extension files are patched on disk — concurrent writes would conflict
- Anvil fork state (snapshot/revert) is shared across tests
- Module-level snapshot cache assumes single-worker execution

## Anvil / Docker Setup

### Prerequisites

- **Docker** (Docker Desktop or Docker Engine)
- **Apple Silicon**: The Anvil Docker image defaults to `linux/amd64`, which requires Rosetta emulation. This is handled automatically by Docker Desktop with Rosetta enabled. If you experience issues:
  ```bash
  # Option 1: Enable Rosetta in Docker Desktop
  # Settings → General → "Use Rosetta for x86_64/amd64 emulation on Apple Silicon"

  # Option 2: Override platform (if using native arm64 Foundry image)
  DOCKER_PLATFORM=linux/arm64 pnpm anvil:up
  ```

### Running Anvil Tests Locally

```bash
cd e2e

# 1. Start Anvil forks (Docker)
pnpm anvil:up

# 2. Wait for health checks to pass (~10-30s)
docker compose -f docker-compose.anvil.yml ps

# 3. Run tests
pnpm test:anvil

# 4. Stop Anvil (automatic with test:anvil, or manual)
pnpm anvil:down
```

### Custom Fork URLs

By default, Anvil forks from public RPCs. For faster/more reliable forks, set private RPC endpoints:

```bash
# In .env or .env.local
MAINNET_FORK_URL=https://eth-mainnet.g.alchemy.com/v2/YOUR_KEY
LINEA_FORK_URL=https://linea-mainnet.g.alchemy.com/v2/YOUR_KEY
```

## CI Setup

### GitHub Secrets

The E2E workflow requires two GitHub Actions secrets:

| Secret | Description |
|--------|-------------|
| `E2E_WALLET_SEED_PHRASE` | BIP-39 mnemonic for the test wallet. **Use a dedicated test-only wallet** — never use a wallet holding real funds. |
| `E2E_WALLET_PASSWORD` | Password for MetaMask unlock during tests. Any value works (e.g. `TestPassword123!`). |

To configure:
1. Go to repository **Settings → Secrets and variables → Actions**
2. Click **New repository secret**
3. Add `E2E_WALLET_SEED_PHRASE` and `E2E_WALLET_PASSWORD`

### CI Triggers

The E2E workflow (`.github/workflows/e2e.yml`) runs on:
- **Vercel deployment success** — tests the preview URL for Hub deployments
- **Push to `main`** — when `e2e/`, `apps/hub/`, or shared packages change
- **Manual dispatch** — with optional custom `base_url`

### What CI Runs

1. Install dependencies + Playwright browsers
2. Download and cache MetaMask extension
3. Lint + typecheck the e2e project
4. Start Anvil Docker forks
5. Run all tests (smoke + wallet + anvil)
6. Upload test report and failure artifacts

## Debugging

```bash
# Step-by-step debug mode (pauses at each action)
pnpm test:debug

# Run with visible browser
pnpm test:headed

# Interactive Playwright UI (pick and run tests)
pnpm test:ui

# Run a single test file
pnpm exec playwright test tests/hub/pre-deposits/weth-deposit.spec.ts

# View last test report
pnpm test:report

# Check Anvil fork health
curl -s -X POST http://localhost:8547 \
  -H 'Content-Type: application/json' \
  -d '{"jsonrpc":"2.0","method":"eth_blockNumber","params":[],"id":1}'
```

### Common Issues

| Issue | Solution |
|-------|----------|
| MetaMask extension not found | Run `pnpm setup:metamask` to download it |
| Anvil connection refused | Run `pnpm anvil:up` and wait for health checks |
| Tests timeout on Apple Silicon | Enable Rosetta in Docker Desktop (see above) |
| `wallet_addEthereumChain` popup | The fixture blocks this via `addInitScript`; if it appears, check fixture setup |
| Smart Transactions interfering | STX is disabled via file patching; update patterns if MetaMask version changes |

## Adding a New Vault

1. **`src/constants/hub/vaults.ts`** — add to `TEST_VAULTS`, `BELOW_MIN_AMOUNTS`, `DEPOSIT_AMOUNTS`
2. **`src/helpers/anvil-rpc.ts`** — add contract address to `CONTRACTS`, funding method, `FUNDING_PRESETS` entry
3. **`src/helpers/anvil-rpc.ts`** — add to `enableAllVaults()`
4. Create test spec files in `tests/hub/pre-deposits/`
