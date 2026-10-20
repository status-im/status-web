# @status-im/sitemap-utils

Private helper functions for the Next.js sitemap configs of the localised sites. Not published to
npm. All functions live in [index.js](./index.js).

## What is in it

- `buildLocalizedPaths(locales, pages)`: expand a list of page slugs into `{ loc }` entries for each
  locale, using `/` for the `en` locale and `/<locale>` prefixes otherwise.
- `discoverPages(appDir)`: walk an App Router `[locale]` directory and return the route slugs that
  have a `page.tsx` or `page.js`, skipping route groups.
- `discoverLegalPages(appDir)`: return the legal page slugs that have a page file.

## Consumers

Used by the `next-sitemap.config.js` of [apps/hub](../../apps/hub), [apps/get.status.app](../../apps/get.status.app)
and [apps/status.network](../../apps/status.network). Example:

    const { buildLocalizedPaths, discoverPages } = require('@status-im/sitemap-utils')

    const PAGES = discoverPages(path.join(__dirname, 'src', 'app'))
    const ALLOWED_PATHS = buildLocalizedPaths(['en', 'ko'], PAGES).map(p => p.loc)
