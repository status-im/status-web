import { describe, expect, it } from 'vitest'

import {
  createBlogSearchDocument,
  createBlogSearchIndex,
  getBlogSearchResultIds,
  loadBlogSearchIndex,
  serializeBlogSearchIndex,
} from './search'

import type { PostOrPage } from '@tryghost/content-api'

const posts: PostOrPage[] = [
  {
    id: 'privacy',
    slug: 'private-messaging',
    title: 'Private messaging in Status',
    custom_excerpt: 'How Status protects conversations.',
    plaintext: 'Learn how Waku keeps messages resilient.',
    tags: [
      {
        id: 'tag-privacy',
        slug: 'privacy-security',
        name: 'Privacy & Security',
      },
    ],
  },
  {
    id: 'developers',
    slug: 'build-a-dapp',
    title: 'Build a dapp',
    excerpt: 'A guide for developers.',
    plaintext: 'Connect a dapp to the Status wallet.',
    tags: [{ id: 'tag-developers', slug: 'developers', name: 'Developers' }],
  },
]

const documents = posts.flatMap(post => {
  const document = createBlogSearchDocument(post)
  return document ? [document] : []
})
const records = documents.map(({ id, categorySlugs }) => ({
  id,
  categorySlugs,
}))

describe('blog search', () => {
  it.each([
    ['Private messaging', ['privacy']],
    ['protects conversations', ['privacy']],
    ['Waku resilient', ['privacy']],
    ['Privacy Security', ['privacy']],
    ['wallet', ['developers']],
  ])('searches all indexed post fields for %s', (query, expected) => {
    expect(
      getBlogSearchResultIds(createBlogSearchIndex(documents), records, query)
    ).toEqual(expected)
  })

  it('combines text search with an exact category filter', () => {
    const index = createBlogSearchIndex(documents)

    expect(
      getBlogSearchResultIds(index, records, 'Status', 'developers')
    ).toEqual(['developers'])
    expect(
      getBlogSearchResultIds(index, records, 'Status', 'privacy-security')
    ).toEqual(['privacy'])
    expect(
      getBlogSearchResultIds(index, records, 'wallet', 'privacy-security')
    ).toEqual([])
  })

  it('keeps publication order when only a category is selected', () => {
    expect(
      getBlogSearchResultIds(
        createBlogSearchIndex(documents),
        records,
        '',
        'developers'
      )
    ).toEqual(['developers'])
  })

  it('restores a generated search index', () => {
    const index = loadBlogSearchIndex(serializeBlogSearchIndex(documents))

    expect(getBlogSearchResultIds(index, records, 'Waku')).toEqual(['privacy'])
  })
})
