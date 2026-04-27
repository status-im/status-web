# status.network

## 0.2.1

### Patch Changes

- 4c9771c: fix(status.network): reuse shared content renderer for karma tokenomics
- d50bf87: fix(blog): show all published posts on /blog
- 41096e0: chore: migrate hoodi
- cd78f57: chore(status.network): update Karma tokenomics details and links

## 0.2.0

### Minor Changes

- 4d178e5: feat: implement technical SEO improvements for i18n support
  - Enhanced sitemap configuration with static file exclusions and whitelist-based path filtering
  - Added hreflang tags (en, ko, x-default) to all pages for proper i18n SEO support
  - Extended metadata system to support pathname parameter for generating canonical URLs and language alternates
  - Created reusable get-pathname utility function to eliminate code duplication
  - Ensured all locale routes are properly included in sitemaps via explicit additionalPaths configuration

### Patch Changes

- ff8dd31: Add JSON-LD schema utilities to @status-im/components for SEO structured data
- d20d30c: Clean up sitemap: remove changefreq/priority, remove fake lastmod on static pages, add blog posts with actual publish dates
- 0d2476e: Fix blog dynamic rendering and locale resolution
- 3a868d0: Remove ko locale from blog pages in sitemap
- f62dd13: add promo bars to status.app and status.network
- 06ceddc: Fix React Server Components CVE vulnerabilities
- e77bed6: add app
- dc4cec8: add i18n to status.network
- aaa2e48: update getting started links
- abcb32c: adjust font weight for legal pages
- d292620: Refactor JSON-LD utilities with default values, add 410 Gone response handling for invalid paths, and implement technical SEO for the Status Network website
- e6096fd: update promo-bar.tsx copy
- ccc91d5: JSON-LD schema type updates, status.network/hub layout and copy, connector assets, blog and karma UI tweaks
- 5975aae: fix: zod version resolution
- 207f4a5: feat: add predeposit disclaimer
- 1d33185: Use Ghost CMS meta fields and custom JSON-LD for blog SEO
- 36502ad: update image alt texts for mobile app features in AppsPage and ImageType definition
- 154287d: feat: add KarmaButton component and integrate into TopBar
- Updated dependencies [ff8dd31]
- Updated dependencies [be3d8dc]
- Updated dependencies [06ceddc]
- Updated dependencies [e77bed6]
- Updated dependencies [e77bed6]
- Updated dependencies [d292620]
- Updated dependencies [0a50862]
- Updated dependencies [ccc91d5]
- Updated dependencies [5975aae]
- Updated dependencies [55cb107]
- Updated dependencies [207f4a5]
  - @status-im/components@1.2.0
  - @status-im/status-network@0.1.2

## 0.1.1

### Patch Changes

- 9c3823b: upgrade next

## 0.1.0

### Minor Changes

- b94eaff: chore: update waku dependencies => update to node 22
- c6dc33b: add `apps/status.network`

### Patch Changes

- 6ab8ac1: fix & add build
- 768dfa3: update favicon
- 7f54964: update status.network stack
- 39b1d11: update status.network assets
