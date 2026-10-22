# e2e

Rules for agents working in `e2e/`. The root [AGENTS.md](../AGENTS.md) applies too. These are Playwright tests for the Hub and the wallet extension; they run against this repo's Hub on port 3003 unless `BASE_URL` points elsewhere.

## Commands

- `pnpm test` runs the suite CI runs: smoke, wallet-flows and anvil.
- `pnpm test:smoke` runs `@smoke` only: no wallet, no forks, and it still starts the local Hub.
- `pnpm test:wallet` needs the MetaMask extension from `pnpm setup:metamask` and a seed in `.env`.
- `pnpm test:anvil`, `pnpm test:all` and `pnpm test:ci` start the Docker forks and stop them afterwards.
- `pnpm anvil:up` and `pnpm anvil:down` are for when you call `playwright test` yourself against `@anvil`.
- `pnpm test:wallet-send` and `pnpm test:wallet-swap` need `pnpm setup:wallet` and a running `apps/api`. `pnpm test:wallet-onboarding` runs `setup:wallet` itself and needs no backend. Keep all three opt-in; do not add them to `pnpm test`.

## Rules

- Put a test-only wallet in `WALLET_SEED_PHRASE`. The address is derived from the seed, and a real seed in a repo file is a leak.
- Tag every test with exactly one of `@smoke`, `@wallet`, `@anvil`, `@wallet-onboarding`, `@wallet-send`, `@wallet-swap`. Projects select on those tags, so an untagged test never runs.
- Do not tag a MetaMask Hub flow `@wallet-send` or `@wallet-swap`. The `wallet-flows` project greps `/@wallet(?![\w-])/` and will pick it up.

## Caveats

- The `@anvil` fixture redirects RPC by the `?chainId=` query parameter and skips `localhost` on purpose, so the Hub has to point `NEXT_PUBLIC_STATUS_API_URL` at a non-localhost host.
- The default fork URLs are pruning nodes. SNT funding reads historical state, so point `MAINNET_FORK_URL` at an archive provider or those tests fail with historical-state errors.
- Put local values in `.env` or `.env.local`, both gitignored. `.env.example` documents names only; never put a value in it.

## Docs

- [README.md](README.md): setup and the full command list.
- [playwright.config.ts](playwright.config.ts): projects, tags, and the servers each project starts.
