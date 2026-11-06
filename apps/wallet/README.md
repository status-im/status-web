# wallet

Status Portfolio Wallet: a WXT browser extension for Chrome and Firefox that holds accounts and
shows a portfolio. A beta wallet and portfolio tracker in one, published on the Chrome Web Store.

## Run

```bash
pnpm --filter wallet dev           # Chrome, dev server on http://localhost:4000
pnpm --filter wallet dev:firefox   # Firefox
```

`dev` is an alias of `dev:chrome`. Load the unpacked build from `.output/chrome-mv3` in Chrome or
`.output/firefox-mv3` in Firefox. Finder hides dotfiles, so press Command + Shift + . to see
`.output`.

```bash
pnpm --filter wallet build     # production Chrome build, then tsc --noEmit
pnpm --filter wallet test      # vitest
pnpm --filter wallet zip:chrome
```

## Environment

`WXT_STATUS_API_URL` is committed in `.env.development` and `.env.production`, pointing at the local
API and at the deployed one. WXT only exposes variables prefixed with `WXT_`.

The extension also reads the API app and the shared wallet package, so those need their own values
in `apps/api/.env.local` and `packages/wallet/.env.local`. The tracked `.env` files only define
names and non-secret defaults; real keys go in the gitignored `.env.local`.

## dApp connections

The [permission store](src/data/dapp-permissions.ts) keeps approved connections across reloads
and account switches. Permission updates require an existing `eth_accounts` grant. The connection
check and write share a Web Lock across extension pages and the background service worker, including
legacy storage migration, so an overlapping permission request cannot restore a disconnected dApp.
Older records without an approved account keep their chain setting but require a new connection
approval. After disconnecting, the user must approve a new connection before the dApp can access
accounts again.

## Signing requests

The approval popup shortens long typed-data fields and transaction data for readability. Use
"Show full value" to inspect the complete content before signing. Field count and nesting limits
still flag content the popup cannot display.

## Chrome Web Store release

The wallet job in [`ci/Jenkinsfile`](../../ci/Jenkinsfile) builds the extension, zips
`.output/chrome-mv3`, archives the ZIP as a build artifact and uploads it. It stops there: nothing
is submitted or published to the store.

To produce the same package locally:

```bash
pnpm install --frozen-lockfile
pnpm exec turbo run build --filter=wallet
pnpm --filter wallet zip:chrome
```

Before uploading, check that the manifest version in the ZIP is higher than the published one, and
load the extracted ZIP in a clean browser profile. Exchange (the swap UI) must not appear in either
token header, while Buy, Receive and Send still do; Exchange is compiled in only for development
builds.

In the existing store item `opkfeajbclhjdneghppfnfiannideafj`, open Package, upload the ZIP from
`.output/` and save the draft. Check the version and the package checks shown for the draft, then
submit. If you want to publish by hand after the review instead of automatically, turn automatic
publishing off in the submission dialog. Submitting and publishing belong to the release owner.

## More

- [Agent guide](AGENTS.md)
