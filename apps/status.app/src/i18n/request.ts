import { getRequestConfig } from 'next-intl/server'

import { routing } from './routing'

/**
 * Resolves the locale without reading the request.
 *
 * `requestLocale` falls back to `headers()` whenever nothing pinned the locale
 * first, and reading headers inside a page Next is rendering statically fails
 * that render outright with "Page changed from static to dynamic at runtime".
 * Requests that skip the middleware arrive in exactly that state, and the
 * matcher skips every path containing a dot, so a crawled URL such as
 * `/blog/run-prater-beacon-node.sh` 500s where it should render its 404.
 *
 * `en` is the only locale and detection is off, so the request could not have
 * changed the answer anyway. When a second locale ships, read the locale back
 * off the request and pin it with `setRequestLocale` in every statically
 * rendered layout, page and `generateMetadata`.
 * why: https://next-intl.dev/docs/getting-started/app-router
 */
export default getRequestConfig(async () => {
  const locale = routing.defaultLocale

  return {
    locale,
    messages: (await import(`../../messages/${locale}.json`)).default,
  }
})
