# status.app

## 0.1.3

### Patch Changes

- e203d91: fix(get.status.app): clean up remaining crypto source content
- db869e8: fix(status.app): stop emitting http://localhost URLs in Article JSON-LD, blog share links and the RSS feed
- 7cf09a6: feat(status.app): add blog search with category filters, shareable URL parameters, and a server-side search API backed by a build-time MiniSearch index
- ef2310f: fix(status.app): render Ghost blog tables without headers to prevent crawler 5xx errors
- a535360: feat(status.app): implement i18n coverage across website and admin UI
- 320438c: fix(get.status.app): remove crypto source content
- dc2abfd: fix(status.app): SEO improvements - native App Router sitemap with dynamic blog/help/specs entries, 301 redirects for legacy help/features/renamed URLs, and proper 404 responses for unknown specs/help slugs
- 86ed961: Update Status app metadata and universal link configuration for the new iOS and Android app details.
- 4a48bcd: Remove legacy iOS app associations from the AASA file so Status universal links resolve to the new app.
- 51c1770: feat(status.app): add /learn page surfacing Status Insights posts from Ghost, with sitemap entry, footer link, and i18n messages
- c265d36: Keep canonical metadata in the document head.
- 9585bda: fix(blog): allow mobile tables to scroll
- b7696b6: refactor(status.app): read the canonical site origin from a single SITE_URL constant
- 3e92c15: chore: upgrade next to version 15.5.16 across all projects
- 551aeb1: feat(status.app): add /feed.xml route and global RSS discovery link for AI crawlers
- 6b34f46: fix(status.app): fix /brand 500 after Next 15.5 upgrade and harden error boundary

  After upgrading to Next.js 15.5.16, `/brand` returned 500 with React error #130 (`Element type is invalid: ... got: undefined`). The brand page defined five nested section components as `const` arrow functions in the same module as client imports; Next 15.5's RSC bundler no longer resolves those references correctly in production. Section UI is now a dedicated `'use client'` module (`brand-sections.tsx`) so Next 15.5's RSC bundler does not treat mixed server/client imports as `undefined`. `JSONLDScript` is imported directly from `@status-im/components` (not the re-export shim), and the locale route uses explicit `export { default, generateMetadata }` only.

  The root `error.tsx` was also fixed: it imported `NotFoundContent`, an async Server Component using `getTranslations` from `next-intl/server`, which broke the error boundary itself and masked the real failure. It now uses a client-only fallback with `useTranslations('error')`.

- 2c6eea3: Deleting unnecessary ref url "ref=our.status.im"
- 92f61f2: feat(status.app): keep body links in the desktop news feed. An anchor in a paragraph or a list item is emitted as `<a href>` instead of being flattened to its label, with the href escaped. The mobile feed keeps the label alone, since plain text cannot carry a link, and the call-to-action is still lifted out of the body.
- 0050832: Add SEO overrides for '/learn' route
- d624890: self-host
- 337b881: fix(status.app): noindex work-in-progress help docs and drop them from the sitemap so thin pages stop being crawled
- 40f0efc: Hide org chart
- 9c2974b: chore(status.app): remove beta warning on help pages
- bb1e5f8: feat(status.app): render bullet and numbered lists in the news RSS feeds. The desktop feed emits `<ul>`/`<ol>` for its rich text view and the mobile feed emits text bullets, keeping its plain text format. Line breaks within a paragraph are preserved, and the call-to-action link is extracted structurally so a link inside a list item cannot replace it.
- b3e3155: feat: connect wallet to dApp
- 20985dc: fix(status.app): style Ghost post tables and reduce blockquote size
- de1916d: fix(status.app): restore static rendering and defer the help search index
- 9f0fd7d: fix(status.app): remove cloaking signals on get.status.app
- bb1e5f8: fix(status.app): escape the desktop news feed's markup. RSS 2.0 defines `description` as character data, so the markup is no longer served as child elements of it. status-go decodes the element with gofeed before the client sees it, so the markup that arrives is unchanged.
- bb1e5f8: fix(status.app): escape the values Ghost supplies to the news RSS feeds. Their CDATA wrappers are dropped on parse, so an unescaped `&` in a title or in the channel description was re-served as invalid XML. Ghost's HTML entities are resolved to their characters too, since names such as `&nbsp;` are undefined in XML and cost the whole feed rather than one character.
- 9337a39: fix(status.app): prevent keycard section overflow
- 86e3659: fix(status.app): demote the prefooter CTA heading to h2 so `/` and `/apps` no longer render two h1 elements
- bb7c373: Send legacy help URLs with renamed slugs directly to their current pages.
- b4f9c24: fix(status.app): move platform detection script to root layout
- 3e9d155: fix(status.app): remove " — Status" suffix from page meta titles
- 3f3b6f3: fix layout for statically exported `apps/`
- 5ae411f: fix job detail page
- 43b7a23: update copy for banners
- d27fc05: fix(status.app): remove "— Status" suffix from blog page titles
- 9df2aa3: fix(status.app): redirect renamed spec slugs (account-address, community-history-service) to stop 404s surfaced by Search Console
- 9bd0e45: fix(status.app): guarantee the specs submodule is present before the build
- ddbf70d: fix(status.app): fail the production build when the specs submodule is missing instead of shipping an empty /specs and 404 detail pages
- e203d91: fix(get.status.app): clean up remaining crypto source content
- fbe88fe: feat(status.app): add Article, FAQPage, and WebPage structured data for help docs and key landing pages
- ccef237: feat(status.app): serve the reworked news feeds under `/v2`. `/desktop-news/rss/v2` and `/mobile-news/rss/v2` carry the lists, the body links, the escaping fixes and the namespaced call-to-action, while `/desktop-news/rss` and `/mobile-news/rss` keep serving the rendering the shipped clients were built against.
- a407f80: fix(sitemap): exclude blog tag pages from sitemap
- 685e3d0: Hide removed get.status.app sections
- bb1e5f8: fix(status.app): move the news feeds' call-to-action into a `status` namespace. RSS 2.0 rejects an extension element that has none, so `newsLink` and `newsLinkLabel` are now `status:newsLink` and `status:newsLinkLabel`. gofeed reads a namespaced element from `item.Extensions` rather than `item.Custom`, so status-go has to read them from there before this ships.
- 6c9c8ed: chore: update withdrawal promo
- 8547cad: add `apps/get.status.app`
- a9affff: Avoid redirect chains for legacy Greenhouse job links.
- 3dcc27e: fix(status.app): prevent desktop navbar overflow, including the floating scroll-up navbar, and make the floating navbar reliably appear in local (Turbopack) dev
- Updated dependencies [13f4451]
  - @status-im/components@1.2.1

## 0.1.2

### Patch Changes

- ff8dd31: Add JSON-LD schema utilities to @status-im/components for SEO structured data
- 720fd5a: chore: update extension assets
- 902875c: Revert "revert status-mobile rename to status-legacy (#881)"
- 456876e: update hero
- 1100022: chore: update docs
- 7b2bda5: chore: update specs repo
- 9780718: chore: update assetlinks.json
- f62dd13: add promo bars to status.app and status.network
- 9a1ad73: chore: update preview page
- 06ceddc: Fix React Server Components CVE vulnerabilities
- 1efb8cf: prep mobile app release
- e6096fd: update promo-bar.tsx copy
- ccc91d5: JSON-LD schema type updates, status.network/hub layout and copy, connector assets, blog and karma UI tweaks
- 5975aae: fix: zod version resolution
- 06d63f4: fix(status.app): prevent RSS route build failures and handle missing blog posts
- 89266d8: update apple-app-site-association
- b66ff9b: fix: build issues with specs
- 36502ad: update image alt texts for mobile app features in AppsPage and ImageType definition
- 154287d: feat: add KarmaButton component and integrate into TopBar
- Updated dependencies [ff8dd31]
- Updated dependencies [be3d8dc]
- Updated dependencies [d292620]
- Updated dependencies [ccc91d5]
- Updated dependencies [5975aae]
- Updated dependencies [55cb107]
  - @status-im/components@1.2.0
  - @status-im/js@1.2.2

## 0.1.1

### Patch Changes

- 9c3823b: upgrade next
- 8d4b40e: Change status-desktop to status-app and status-mobile to status-legacy
- Updated dependencies [808b782]
  - @status-im/js@1.2.1

## 0.1.0

### Minor Changes

- b94eaff: chore: update waku dependencies => update to node 22
- 70e549e: add `apps/status.app`

### Patch Changes

- 81dda43: fix /specs after migration
- 0fc8835: fix(release): scope remark linting to content directory only
- 3090f93: fix & add status.app to build
- 2fab51f: reference new mobile app
- b775a1d: fix vercel build ignoreCommand
- b705085: chore: reduce cloudinary usage
- 0f43dee: Rename 'Mobile' to 'New mobile' in routes
- Updated dependencies [6e65af8]
- Updated dependencies [0a14da4]
- Updated dependencies [fdc3fe9]
- Updated dependencies [f41f0e3]
- Updated dependencies [66d30c0]
- Updated dependencies [aca00b0]
- Updated dependencies [8467e46]
  - @status-im/components@1.1.0
  - @status-im/js@1.2.0
