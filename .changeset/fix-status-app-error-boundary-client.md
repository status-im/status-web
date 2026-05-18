---
'status.app': patch
---

fix(status.app): fix /brand 500 after Next 15.5 upgrade and harden error boundary

After upgrading to Next.js 15.5.16, `/brand` returned 500 with React error #130 (`Element type is invalid: ... got: undefined`). The brand page defined five nested section components as `const` arrow functions in the same module as client imports; Next 15.5's RSC bundler no longer resolves those references correctly in production. Section UI is now a dedicated `'use client'` module (`brand-sections.tsx`) so Next 15.5's RSC bundler does not treat mixed server/client imports as `undefined`. `JSONLDScript` is imported directly from `@status-im/components` (not the re-export shim), and the locale route uses explicit `export { default, generateMetadata }` only.

The root `error.tsx` was also fixed: it imported `NotFoundContent`, an async Server Component using `getTranslations` from `next-intl/server`, which broke the error boundary itself and masked the real failure. It now uses a client-only fallback with `useTranslations('error')`.
