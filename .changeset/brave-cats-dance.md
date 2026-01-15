---
'hub': minor
---

fix: add locale support to canonical URLs for i18n SEO

- Updated metadata generation to include locale prefix in canonical URLs (e.g., `/ko/pre-deposits` for Korean pages)
- Refactored metadata generation to use shared utility from `@status-im/status-network/utils`
- Ensured proper hreflang tags are generated for all locale-specific pages
