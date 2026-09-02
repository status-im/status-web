/**
 * Canonical public origin for status.app.
 *
 * Single source of truth for every absolute URL this app emits into HTML,
 * feeds and structured data (canonicals, sitemap, robots, RSS, JSON-LD, share
 * links). Origin only, no trailing slash.
 */
export const SITE_URL = 'https://status.app'

/** How Status describes itself, independent of whichever page is rendering. */
export const SITE_NAME = 'Status'
export const SITE_DESCRIPTION =
  'The open-source, decentralised wallet and messenger. Own your crypto and chat privately.'

/**
 * Publisher and organization logo for structured data. Raster on purpose:
 * Google does not read SVG for these properties, and `/logo.svg`, which the
 * blog used to point at, has never existed.
 */
export const SITE_LOGO_URL = `${SITE_URL}/icon.png`
