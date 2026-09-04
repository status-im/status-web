import { notFound, permanentRedirect } from 'next/navigation'

/**
 * Read a `/page/[page]` URL segment.
 *
 * Page 1 is the archive root itself, so `/page/1` is rejected rather than
 * served as a second URL for the same listing. `resolvePageParam` redirects it.
 */
export function parsePageParam(value: string): number | null {
  if (!/^[1-9][0-9]*$/.test(value)) {
    return null
  }

  const page = Number(value)

  // Ghost answers any page up to 2^53 with an empty list, which the routes
  // read as "no such page". Past that it starts throwing instead (a 404, then
  // a 422 once JS serialises the number in exponent form), which would turn
  // a made-up URL into a 500.
  if (!Number.isSafeInteger(page)) {
    return null
  }

  return page >= 2 ? page : null
}

/**
 * Resolve a `/page/[page]` segment, or leave the route.
 *
 * `next.config.mjs` collapses `/page/1` onto the archive root before a request
 * reaches the app, but only for the unprefixed paths it lists. Redirecting
 * here as well keeps the collapse working for any prefixed variant, which is
 * what a locale-prefixed URL like `/en/blog/page/1` becomes the moment
 * `localePrefix` stops stripping the default locale.
 */
export function resolvePageParam(value: string, basePath: string): number {
  if (value === '1') {
    permanentRedirect(basePath)
  }

  const page = parsePageParam(value)

  if (!page) {
    notFound()
  }

  return page
}
