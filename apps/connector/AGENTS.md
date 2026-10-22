# AGENTS.md

Rules for agents working in `apps/connector`. The root `AGENTS.md` also applies.

## Role

A Plasmo browser extension (Chrome, Safari, Firefox) that connects dapps to the Status Desktop
Wallet. It injects `window.ethereum` and relays requests; it must never create or sign wallets on
its own.

## Commands

- `pnpm --filter connector dev` (alias of `dev:chrome`): Plasmo dev for Chrome MV3.
- `pnpm --filter connector dev:safari` / `dev:firefox`: other dev targets.
- `pnpm --filter connector build`: Chrome production build to `build/chrome-mv3-prod`.
- `pnpm --filter connector build:firefox`: Firefox build that also zips.

## Rules

- Plasmo builds the extension from the `manifest` key in `package.json` (manifest version,
  permissions, host permissions, `browser_specific_settings`) plus the `src/contents/` and
  `src/background.ts` entrypoints. There is no standalone manifest file to edit.
- Safari has no build script: after `dev:safari`, convert with `xcrun
safari-web-extension-converter` and build with `xcodebuild` (steps in the README).
- Output dirs: `build/chrome-mv3-dev` (dev), `build/chrome-mv3-prod` (build),
  `build/safari-mv3-dev`, `build/firefox-mv3-prod.zip`.

## Gotchas

- `package.json` declares React 18.2.0, but the root `pnpm.overrides` (`react: 19.1.2`) overrides
  it, so the app actually runs React 19.1.2 like the rest of the repo.
- Safari and Firefox do not auto-reload; rebuild and reload on every change.
- `src/contents/provider.ts` sets `window.ethereum`; the injection helpers come from
  `@status-im/ethereum-provider`.

## Docs

- [README.md](README.md): run, build, browser load and testing steps.
