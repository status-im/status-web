# @status-im/sitemap-utils

Sitemap helpers for the statically exported sites. Private to this repo, not published. The three functions live in [index.js](./index.js) and are plain CommonJS, because `next-sitemap` loads its config with `require`.

## What each function does

`buildLocalizedPaths(locales, pages)` turns slugs into `{ loc }` entries for [next-sitemap](https://github.com/iamvishnusankar/next-sitemap): `/` for `en`, `/<locale>` for the root of another locale, and `/<locale>/<slug>` for the rest. `''` counts as the root page.

`discoverPages(appDir)` returns the slugs under `<appDir>/[locale]` that have a `page.tsx` or `page.js`. It skips directories starting with `_` or `[` and strips route groups such as `(with-nav)` from the slug. If there is no `[locale]` folder it warns and returns `['']`.

`discoverLegalPages(appDir)` returns the slugs of `<appDir>/legal/<slug>` that have a page file. It looks one level deep only.

## Usage

From a `next-sitemap.config.js`:

```js
/* eslint-env node */
const path = require('path')
const {
  buildLocalizedPaths,
  discoverLegalPages,
  discoverPages,
} = require('@status-im/sitemap-utils')

const APP_DIR = path.join(__dirname, 'src', 'app')
const PAGES = discoverPages(APP_DIR)
const LEGAL_PAGES = discoverLegalPages(APP_DIR)
const ALLOWED_PATHS = buildLocalizedPaths(['en', 'ko'], PAGES).map(p => p.loc)
```

The config's `transform` returns `null` for anything outside `ALLOWED_PATHS`, and [apps/get.status.app](../../apps/get.status.app/next-sitemap.config.js) adds its legal pages from `discoverLegalPages` in `additionalPaths`. [apps/hub](../../apps/hub/next-sitemap.config.js) and [apps/status.network](../../apps/status.network/next-sitemap.config.js) load the same way, and status.network fetches its Ghost blog posts into `additionalPaths` itself.

Page discovery reads the file system at build time, so a new route reaches the sitemap only if the build runs after you create its `page.tsx`. Dynamic segments are skipped, which is why blog posts and anything else generated per record need their own `additionalPaths` code.
