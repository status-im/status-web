---
'@status-im/components': minor
'hub': patch
'status.network': patch
---

Refactor JSON-LD utilities to use shared `createAppJSONLD` function

- Add `createAppJSONLD` function to `@status-im/components` for shared JSON-LD schema generation
- Remove default values - all required fields must be provided explicitly
- Add support for `@id` and `publisher` in `OrganizationSchema` and `WebSiteSchema`
- Add `WebPageSchema` type and `webpage` method
- Consolidate duplicate code between hub and status.network apps
