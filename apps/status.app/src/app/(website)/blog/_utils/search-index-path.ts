/**
 * Location of the generated blog search index, relative to the app root.
 *
 * Shared by the build script that writes it and the server module that reads
 * it. Kept out of `./search.server` because that imports `server-only`, which
 * throws when pulled into a plain Node build script.
 *
 * Deliberately outside `public/`: the index is only read on the server, and at
 * ~3MB it has no business being a downloadable static asset. It is kept in the
 * deployment bundle by `outputFileTracingIncludes` in next.config.mjs.
 */
export const BLOG_SEARCH_INDEX_DIRECTORY = '.blog-search'
export const BLOG_SEARCH_INDEX_FILENAME = 'index.json'
