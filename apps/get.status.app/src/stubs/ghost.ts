import type { PostOrPage } from '@tryghost/content-api'

/**
 * Blog/Ghost is not part of get.status.app. This stub satisfies imports from
 * shared status.app pages (e.g. homepage) without requiring Ghost env vars.
 */
export async function getPosts(
  _params: {
    page?: number
    limit?: number
    tag?: string
  } = {}
) {
  const limit = _params.limit ?? 7

  return {
    posts: [] as PostOrPage[],
    meta: {
      pagination: {
        page: 1,
        limit,
        pages: 0,
        total: 0,
        next: null,
        prev: null,
      },
    },
  }
}

// Never called on get.status.app (guarded by isGetSite in the shared page); the
// parameter exists only for type compatibility with the real ghost lib signature.
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function findLatestReleasePost(_posts: PostOrPage[]): PostOrPage | null {
  return null
}
