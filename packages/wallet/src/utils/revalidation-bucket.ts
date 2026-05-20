/**
 * Partition the Next.js fetch-cache key by the revalidate window so that the
 * first request after the window expires is a cache MISS (synchronous fresh
 * fetch) rather than a stale-while-revalidate hit. Without this, the route
 * returns the previous snapshot — potentially many hours old after an idle
 * period — while revalidation happens in the background.
 */
export function setRevalidationBucket(url: URL, revalidate: number): void {
  url.searchParams.set(
    '_bucket',
    String(Math.floor(Date.now() / (revalidate * 1000))),
  )
}
