# e2e

Playwright and TypeScript end-to-end tests for the [Status Network Hub](https://hub.status.network) and the wallet extension. Tags, projects and the dev servers each project needs are in [`playwright.config.ts`](./playwright.config.ts); page objects and fixtures are under [`src/`](./src).

The default target is this repo's Hub: Playwright builds the Hub's workspace dependencies and starts `next dev` on `http://localhost:3003`, so a run covers the branch you are on. CI does the same on pull requests, `master` and `develop`. To test a deployed build instead, set `BASE_URL`, which is what stops the local server:

```bash
BASE_URL=https://hub.status.network pnpm test:smoke
```

## Commands

```bash
# first run, from the repo root
pnpm install
cd e2e
pnpm exec playwright install chromium
cp .env.example .env      # WALLET_SEED_PHRASE: a test-only wallet, the address is derived
pnpm setup:metamask       # MetaMask 13.18.1 for the @wallet flows, METAMASK_VERSION overrides
# suites
pnpm test                 # smoke + wallet-flows + anvil, the set CI runs
pnpm test:smoke           # @smoke only: headless, no wallet, no forks
pnpm test:wallet          # @wallet only: MetaMask-driven Hub flows, headed
pnpm test:anvil           # starts the Anvil forks, runs @anvil, stops them
pnpm test:all             # forks up, smoke, wallet, anvil, forks down
pnpm test:ci              # forks up, whole suite with CI=true, forks down
pnpm test:static-export   # build then serve the three static exports
pnpm test:get-static      # deprecated alias for the same config
# forks, and the servers the wallet extension projects need
pnpm anvil:up             # mainnet and Linea forks in Docker
pnpm anvil:down
pnpm setup:wallet         # build the extension against http://localhost:3030
pnpm test:wallet-onboarding  # recovery-phrase grid, no backend needed
pnpm test:wallet-send        # native ETH send against the fork
pnpm test:wallet-swap        # LiFi swap against the fork
# one file, conveniences, hygiene
pnpm exec playwright test tests/hub/pre-deposits/pre-deposits-display.spec.ts
pnpm test:headed   # visible browser
pnpm test:debug    # inspector
pnpm test:ui       # UI mode
pnpm test:report   # last HTML report
pnpm lint
pnpm typecheck
pnpm format
pnpm clean
```

## Tags

`@smoke` runs in the `smoke` project (headless, no wallet), `@wallet` in `wallet-flows` (MetaMask, headed), and `@anvil` in `anvil` (headed, needs the forks). `@wallet-onboarding`, `@wallet-send` and `@wallet-swap` have their own projects, gated by `RUN_WALLET_ONBOARDING` and `RUN_WALLET_E2E`.

Tag every test with exactly one of them. `wallet-flows` greps `/@wallet(?![\w-])/`, so a `@wallet-send` or `@wallet-swap` test stays out of the MetaMask flows.

## Anvil forks

The `@anvil` fixture redirects the Hub's JSON-RPC to the forks. The Hub sends wallet RPC to `${NEXT_PUBLIC_STATUS_API_URL}/api/trpc/rpc.proxy?chainId=N`, so the `webServer` points that variable at a non-localhost host (the fixture skips `localhost` on purpose) and redirects by `chainId`. `HUB_STATUS_API_URL` overrides the host. The wallet extension projects start `apps/api` on 3030 plus a path-forwarding `rpc-router` on 8548 instead.
