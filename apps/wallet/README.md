# wallet

Status Portfolio Wallet: a WXT browser extension for viewing and managing crypto portfolios. A beta
crypto wallet and Web3 portfolio tracker in one, available on the Chrome Web Store.

## Run

    pnpm --filter wallet dev           # Chrome, dev server on http://localhost:4000
    pnpm --filter wallet dev:chrome    # same as dev
    pnpm --filter wallet dev:firefox

Load the unpacked build from `.output/chrome-mv3` (Chrome) or `.output/firefox-mv3` (Firefox).

## Environment

`WXT_STATUS_API_URL` lives in the committed `.env.development` and `.env.production` files. The
extension also depends on the API app and the shared wallet package: see `apps/api/.env` and
`packages/wallet/.env`.

## Release

See [Chrome Web Store release](#chrome-web-store-release).

## More

- [Agent guide](AGENTS.md)

## Chrome Web Store release

The wallet job in [`ci/Jenkinsfile`](../../ci/Jenkinsfile) builds `wallet`, zips
`.output/chrome-mv3`, archives the ZIP and uploads the artifact. It does not submit or publish the
extension to the Chrome Web Store.

To prepare the same production package locally:

    pnpm install --frozen-lockfile
    pnpm exec turbo run build --filter=wallet
    pnpm --filter wallet zip:chrome

Check the ZIP's manifest version is higher than the published version and load the extracted ZIP in
a test browser. Verify Exchange is absent from both token headers and that Buy, Receive and Send
still appear.

In the existing Web Store item `opkfeajbclhjdneghppfnfiannideafj`, open Package and upload the ZIP
from `.output/`. Save the draft and verify the version and package checks before submitting for
review. For manual publication after review, turn off automatic publishing in the submission
dialog. Final submission and publication belong to the release owner.
