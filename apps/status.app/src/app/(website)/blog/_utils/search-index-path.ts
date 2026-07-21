/**
 * Location of the generated blog search index, relative to the app root.
 *
 * Shared by the build script that writes it and the server module that reads
 * it. Kept out of `./search.server` because that imports `server-only`, which
 * throws when pulled into a plain Node build script.
 *
 * It lives under `public/` so the deployment bundles it as a static asset that
 * the server can still read from disk. Moving it elsewhere requires an
 * `outputFileTracingIncludes` entry, which is a trap: a `./dir/**\/*` glob there
 * also drags `.next/cache/webpack/*.pack` into the function and blows past
 * Vercel's 250mb function limit. Nothing fetches this file from the browser --
 * blog search goes through /api/blog/search.
 */
export const BLOG_SEARCH_INDEX_DIRECTORY = 'public'
export const BLOG_SEARCH_INDEX_FILENAME = 'blog-search-index.json'
