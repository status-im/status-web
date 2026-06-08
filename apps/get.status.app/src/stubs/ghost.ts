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

export function findLatestReleasePost(): PostOrPage | null
export function findLatestReleasePost(_posts: PostOrPage[]): PostOrPage | null
export function findLatestReleasePost(
  _posts?: PostOrPage[]
): PostOrPage | null {
  void _posts
  return null
}
