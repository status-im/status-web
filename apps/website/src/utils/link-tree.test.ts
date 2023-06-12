import { expect, it } from 'vitest'

import type { Doc } from '@docs'

const docs = [
  {
    title: 'Meow Party',
    date: '2021-12-24T00:00:00.000Z',
    _id: 'getting-started.md',
    _raw: {
      sourceFilePath: 'getting-started.md',
      sourceFileName: 'getting-started.md',
      sourceFileDir: '.',
      contentType: 'markdown',
      flattenedPath: 'getting-started',
    },
    type: 'Doc',
    slug: ['getting-started'],
    url: '/learn/getting-started',
    last_edited: '2023-06-09T09:12:28.106Z',
  },
  {
    title: 'Now valid',
    date: '2021-12-24T00:00:00.000Z',
    _id: 'invalid.md',
    _raw: {
      sourceFilePath: 'invalid.md',
      sourceFileName: 'invalid.md',
      sourceFileDir: '.',
      contentType: 'markdown',
      flattenedPath: 'invalid',
    },
    type: 'Doc',
    slug: ['invalid'],
    url: '/learn/invalid',
    last_edited: '2023-06-08T13:32:20.051Z',
  },
  {
    title: 'Meow Party',
    date: '2021-12-24T00:00:00.000Z',
    _id: 'toc.md',
    _raw: {
      sourceFilePath: 'toc.md',
      sourceFileName: 'toc.md',
      sourceFileDir: '.',
      contentType: 'markdown',
      flattenedPath: 'toc',
    },
    type: 'Doc',
    slug: ['toc'],
    url: '/learn/toc',
    pathSegments: [],
    headings: [
      {
        level: 1,
        value: 'Alpha',
      },
      {
        level: 2,
        value: 'Table of contents',
      },
      {
        level: 2,
        value: 'Bravo',
      },
      {
        level: 3,
        value: 'Charlie',
      },
      {
        level: 2,
        value: 'Delta',
      },
    ],
    last_edited: '2023-06-08T10:54:04.412Z',
  },
  {
    title: 'INDEX',
    date: '2021-12-24T00:00:00.000Z',
    _id: 'nested/index.md',
    _raw: {
      sourceFilePath: 'nested/index.md',
      sourceFileName: 'index.md',
      sourceFileDir: 'nested',
      contentType: 'markdown',
      flattenedPath: 'nested',
    },
    type: 'Doc',
    slug: ['nested'],
    url: '/learn/nested',
    last_edited: '2023-06-09T09:39:26.534Z',
  },
  {
    title: 'Heyyy test',
    date: '2021-12-24T00:00:00.000Z',
    _id: 'nested/test-he.md',
    _raw: {
      sourceFilePath: 'nested/test-he.md',
      sourceFileName: 'test-he.md',
      sourceFileDir: 'nested',
      contentType: 'markdown',
      flattenedPath: 'nested/test-he',
    },
    type: 'Doc',
    slug: ['nested', 'test-he'],
    url: '/learn/nested/test-he',
    last_edited: '2023-06-09T09:13:25.260Z',
  },
  {
    title: 'Wallet',
    date: '2021-12-24T00:00:00.000Z',
    _id: 'something/wallet.md',
    _raw: {
      sourceFilePath: 'something/wallet.md',
      sourceFileName: 'wallet.md',
      sourceFileDir: 'something',
      contentType: 'markdown',
      flattenedPath: 'something/wallet',
    },
    type: 'Doc',
    slug: ['something', 'wallet'],
    url: '/learn/something/wallet',
    last_edited: '2023-06-09T09:13:46.208Z',
  },
  {
    title: 'Nested test',
    date: '2021-12-24T00:00:00.000Z',
    _id: 'nested/something/test.md',
    _raw: {
      sourceFilePath: 'nested/something/test.md',
      sourceFileName: 'test.md',
      sourceFileDir: 'nested/something',
      contentType: 'markdown',
      flattenedPath: 'nested/something/test',
    },
    type: 'Doc',
    slug: ['nested', 'something', 'test'],
    url: '/learn/nested/something/test',
    last_edited: '2023-06-09T09:13:20.643Z',
  },
]

type Links = {
  label: string
  href?: string
  links?: Links[]
}

function createLinks(docs: Doc[]): Links[] {
  function createNestedLinks(slugs: string[], remainingDocs: Doc[]): Links[] {
    if (slugs.length === 0) return []

    const currentSlug = slugs[0]
    const filteredDocs = remainingDocs.filter(
      doc => doc.slug[0] === currentSlug
    )
    const remainingSlugs = slugs.slice(1)

    return filteredDocs.map(doc => {
      const link: Links = {
        label: currentSlug,
        href: doc.href,
        links: createNestedLinks(remainingSlugs, filteredDocs),
      }

      return link
    })
  }

  const slugs = Array.from(new Set(docs.flatMap(doc => doc.slug)))
  return createNestedLinks(slugs, docs)
}

it('should pass', () => {
  expect(createLinks(docs as Doc[])).toEqual([
    {
      label: 'getting-started',
      href: '/learn/getting-started',
      links: [],
    },
    {
      label: 'invalid',
      href: '/learn/invalid',
      links: [],
    },
    {
      label: 'toc',
      href: '/learn/toc',
      links: [],
    },
    {
      label: 'nested',
      href: '/learn/nested',
      links: [
        {
          label: 'test-he',
          href: '/learn/test-he',
          links: [],
        },
        {
          label: 'something',
          links: [
            {
              label: 'test',
              href: '/learn/test',
              links: [],
            },
          ],
        },
      ],
    },
    {
      label: 'something',
      links: [
        {
          label: 'wallet',
          href: '/learn/wallet',
          links: [],
        },
      ],
    },
  ])
})
