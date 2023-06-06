import GhostContentAPI from '@tryghost/content-api'

const ghost = new GhostContentAPI({
  url: 'https://demo.ghost.io',
  key: '22444f78447824223cefc48062',
  version: 'v5.0',
})

export const getPosts = async () => {
  return await ghost.posts.browse({
    limit: 'all',
    include: ['tags', 'authors'],
  })
}

export const getPostBySlug = async (slug: string) => {
  return await ghost.posts.read(
    {
      slug,
    },
    {
      include: ['tags', 'authors'],
    }
  )
}

export const getSlugs = async (): Promise<string[]> => {
  const posts = await ghost.posts.browse({
    limit: 'all',
    fields: 'slug',
  })

  return posts.map(post => post.slug)
}
