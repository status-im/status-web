# E2E Tests

Playwright + TypeScript E2E tests for [Status Network Hub](https://hub.status.network).

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

Tests use Playwright tags (`@smoke`, `@wallet`) mapped to projects in `playwright.config.ts`:

```ts
test('my test', { tag: '@smoke' }, async ({ page }) => {
  // ...
})
```
