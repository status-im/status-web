# A wallet extension by Status

## Compatibility

Tested with these browsers:

- Google Chrome

## Development

### Env

Set environment variables in:

- [`apps/api/.env`](../api/.env)
- [`packages/wallet/.env`](../../packages/wallet/.env)

### Google Chrome

#### Develop

Follow [Getting Started](../../README.md#getting-started)

#### Load

Google Chrome > Window > Extensions > enable Developer mode

Google Chrome > Window > Extensions > Load unpacked > select build (.output/chrome-mv3)

> Note: Reloads automatically in development.

> Note: Press Command + Shift + . to show hidden files like `.output/`.

#### Visit

Google Chrome > Extensions > !Status Portfolio Wallet (Beta) > Inspect views > service worker

Google Chrome > Toolbar > Extensions > !Status Portfolio Wallet (Beta)

Google Chrome > Toolbar > Extensions > !Status Portfolio Wallet (Beta) > Open side panel

chrome-extension://\[ID]/page.html#/portfolio

chrome-extension://\[ID]/page.html#/onboarding

### Swap availability

`src/lib/feature-flags.ts` controls Swap (labelled "Exchange" in the UI).
It is enabled only when WXT's `import.meta.env.MODE` is `development`,
including standalone development builds used by E2E tests. Production builds
hide both the token detail action and its sticky header action, including
their disabled watch-only variants. Chrome's Developer mode toggle does not
change this build-time flag.

## Chrome Web Store release

The wallet job linked in the root README uses `ci/Jenkinsfile` to build
`wallet`, zip `.output/chrome-mv3`, archive the ZIP, and upload the artifact.
It does not submit or publish the extension to the Chrome Web Store.

To prepare the same production package locally:

```sh
pnpm install --frozen-lockfile
pnpm exec turbo run build --filter=wallet
pnpm --filter wallet zip:chrome
```

Check the ZIP's manifest version is higher than the published version and
load the extracted ZIP in a test browser. Verify Exchange is absent from
both token headers and that Buy, Receive, and Send still appear.

In the existing Web Store item `opkfeajbclhjdneghppfnfiannideafj`, open
Package and upload the ZIP from `.output/`. Save the draft and verify the
version and package checks before submitting for review. For manual
publication after review, turn off automatic publishing in the submission
dialog. Final submission/publication belongs to the release owner.
