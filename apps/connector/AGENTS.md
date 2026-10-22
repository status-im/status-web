# AGENTS.md

Rules for agents working in `apps/connector`. The root `AGENTS.md` also applies.

## Role

A Plasmo extension for Chrome, Safari and Firefox that connects dapps to the Status Desktop Wallet.
It injects `window.ethereum` and relays requests to Desktop. It never creates or signs wallets of
its own.

## Commands

- `pnpm --filter connector dev` (alias of `dev:chrome`): Plasmo dev for Chrome MV3.
- `pnpm --filter connector dev:safari` / `dev:firefox`: the other dev targets.
- `pnpm --filter connector build`: Chrome production build in `build/chrome-mv3-prod`.
- `pnpm --filter connector build:firefox`: Firefox build, zipped as well.

## Rules

- The manifest comes from the `manifest` key in `package.json` (manifest version, permissions, host
  permissions, `browser_specific_settings`), together with the `src/contents/` and
  `src/background.ts` entrypoints. There is no manifest file to edit.
- Safari has no build script: run `dev:safari`, convert with
  `xcrun safari-web-extension-converter`, then build with `xcodebuild`. The README has the exact
  commands.
- Output directories: `build/chrome-mv3-dev` (dev), `build/chrome-mv3-prod` (build),
  `build/safari-mv3-dev` and `build/firefox-mv3-prod.zip`.

## Caveats

- `package.json` declares React 18.2.0, but `pnpm.overrides` at the root pins React 19.1.2, so the
  extension builds against React 19.1.2 like the rest of the repo.
- Safari and Firefox do not reload the extension when the build changes. Reload it by hand each
  time.
- `src/contents/provider.ts` injects and announces the provider; the helpers come from
  `@status-im/ethereum-provider`.

## Docs

- [README.md](README.md): run, build, browser load and testing steps.
