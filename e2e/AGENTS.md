# AGENTS.md

Rules for agents working in `e2e/`. The root `AGENTS.md` also applies.

## Role

Playwright + TypeScript end-to-end tests for the Status Network Hub and the wallet extension. Tests run against this repo's Hub code by default (local dev server on port 3003) unless `BASE_URL` points at a deployed build.

## Commands

- `pnpm test` runs the core suite (smoke + wallet-flows + anvil); this is what CI runs.
- `pnpm test:smoke` runs `@smoke` tests only (headless, no wallet, no forks).
- `pnpm test:wallet` runs the MetaMask-driven Hub `@wallet` flows (headed).
- `pnpm test:anvil` starts the Anvil forks, runs `@anvil`, then tears down.
- `pnpm anvil:up` / `pnpm anvil:down` manage the Docker forks manually.
- Wallet-extension projects (`test:wallet-onboarding`, `test:wallet-send`, `test:wallet-swap`) are opt-in and need `pnpm setup:wallet` plus a running apps/api.

## Rules

- Use a test-only wallet in `WALLET_SEED_PHRASE`, never a real one. The address is derived from the seed.
- Tag every test with exactly one of `@smoke`, `@wallet`, `@anvil`, `@wallet-onboarding`, `@wallet-send`, `@wallet-swap`. The Playwright project greps depend on these tags.
- `@wallet` matches the MetaMask Hub flows. The `wallet-flows` project greps `/@wallet(?![\w-])/`, so do not tag a MetaMask flow `@wallet-send` or `@wallet-swap`, or it will be picked up by the wrong project.
- `@anvil` tests need the Docker forks running. Let `test:anvil` / `test:all` / `test:ci` manage them, or call `anvil:up` first.

## Caveats

- The `@anvil` fixture redirects RPC by the `?chainId=` query param and deliberately skips `localhost`; the Hub must point `NEXT_PUBLIC_STATUS_API_URL` at a non-localhost host.
- Default fork URLs are pruning nodes. SNT funding reads historical state, so point `MAINNET_FORK_URL` at an archive provider or those tests fail with historical-state errors.
- Copy `.env.example` to `.env` and set values in `.env` (gitignored). Never put values, especially `WALLET_SEED_PHRASE`, in `.env.example`.

## Docs

- [README.md](README.md): quick start and full command reference.
- [playwright.config.ts](playwright.config.ts): projects, tags and the servers each one starts.
