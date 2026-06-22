# E2E Tests

Playwright + TypeScript E2E tests for the [Status Network Hub](https://hub.status.network).

By default the tests run against **this repo's Hub code**: Playwright builds the
Hub's workspace deps and starts a local dev server on `http://localhost:3003`
(see `webServer` in `playwright.config.ts`), then points the tests at it. The
same setup runs in CI on PRs and `main`, so tests always validate the branch.

To test a deployed build instead, set `BASE_URL` (the dev server is skipped for
non-localhost targets):

```bash
BASE_URL=https://hub.status.network pnpm test:smoke   # prod / Vercel preview
```

## Quick Start

```bash
# From the monorepo root:
pnpm install

cd e2e
pnpm exec playwright install chromium

# Configure environment
cp .env.example .env
# Edit .env — set WALLET_SEED_PHRASE for wallet/anvil tests (use a test-only wallet!)
# The wallet address is derived from the seed automatically.

# (Optional) Download MetaMask extension for wallet tests
pnpm setup:metamask

# Run smoke tests (auto-starts the local Hub)
pnpm test:smoke
```

## Commands

```bash
pnpm test              # All projects (smoke + wallet + anvil)
pnpm test:smoke        # Smoke tests (@smoke tag, headless, no wallet)
pnpm test:wallet       # Wallet tests (@wallet tag, headed + MetaMask)
pnpm test:anvil        # On-chain tests (@anvil tag): starts Anvil forks, runs, tears down
pnpm test:all          # Forks up → smoke → wallet → anvil → forks down
pnpm anvil:up          # Start local mainnet + Linea Anvil forks (Docker)
pnpm anvil:down        # Stop the forks
pnpm test:headed       # All tests with visible browser
pnpm test:debug        # Step-by-step debug mode
pnpm test:ui           # Interactive Playwright UI
pnpm test:report       # Open last HTML report
pnpm lint              # ESLint
pnpm typecheck         # TypeScript type check
pnpm format            # Prettier formatting
pnpm clean             # Remove test artifacts and extensions
```

The `@anvil` tests need the Docker forks running. `pnpm test:anvil` / `test:all`
manage them for you; if you run Playwright directly, start them first with
`pnpm anvil:up`.

Run a specific file:

```bash
pnpm exec playwright test tests/hub/pre-deposits/pre-deposits-display.spec.ts
```

## Tags

Tests use Playwright tags (`@smoke`, `@wallet`, `@anvil`) mapped to projects in `playwright.config.ts`:

```ts
test('my test', { tag: '@smoke' }, async ({ page }) => {
  // ...
})
```

## How the local Hub talks to the Anvil forks

The `@anvil` fixture redirects the Hub's JSON-RPC to the local forks. The Hub
sends wallet RPC through `${NEXT_PUBLIC_STATUS_API_URL}/api/trpc/rpc.proxy?chainId=N`,
so the `webServer` sets `NEXT_PUBLIC_STATUS_API_URL` to a non-localhost host
(the interceptor deliberately skips `localhost`) and redirects by the `chainId`
query param. Override the host with `HUB_STATUS_API_URL` if needed.
