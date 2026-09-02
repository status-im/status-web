/**
 * Read a `/page/[page]` URL segment.
 *
 * Page 1 is the archive root itself, so `/page/1` is rejected rather than
 * served as a second URL for the same listing. `next.config.mjs` redirects it.
 */
export function parsePageParam(value: string): number | null {
  if (!/^[1-9][0-9]*$/.test(value)) {
    return null
  }

  const page = Number(value)

  return page >= 2 ? page : null
}
