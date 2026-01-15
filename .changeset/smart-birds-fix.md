---
'hub': minor
'status.network': minor
---

feat: implement technical SEO improvements for i18n support

- Enhanced sitemap configuration with static file exclusions and whitelist-based path filtering
- Added hreflang tags (en, ko, x-default) to all pages for proper i18n SEO support
- Extended metadata system to support pathname parameter for generating canonical URLs and language alternates
- Created reusable get-pathname utility function to eliminate code duplication
- Ensured all locale routes are properly included in sitemaps via explicit additionalPaths configuration
