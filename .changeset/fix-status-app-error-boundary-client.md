---
'status.app': patch
---

fix(status.app): make root error boundary self-contained and client-safe

The root `error.tsx` is a Client Component but was importing `NotFoundContent`, an async Server Component that calls `getTranslations` from `next-intl/server`. In Next 15.5 this resolves to `undefined` in the client/SSR-client bundle, so whenever the error boundary tried to render it failed with `Element type is invalid: ... got: undefined` on the server and `getTranslations is not supported in Client Components` on the client — masking the real underlying error (e.g. on `/brand`) and turning it into a 500 / blank page.

The boundary now renders its own client-only fallback using `useTranslations('error')` and no longer pulls in any server-only modules.
