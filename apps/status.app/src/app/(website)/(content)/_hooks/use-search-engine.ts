import { useCallback, useState } from 'react'

import MiniSearch from 'minisearch'

import type { SearchType } from '../_components/search-button'
import type { DocIndex } from '~/../contentlayer.config'
import type { SearchResult as MiniSearchResult } from 'minisearch'

type SearchResult = MiniSearchResult & {
  title: string
  heading: string
  text: string
  path: string
  matches: {
    title: string[]
    heading: string[]
    text: string[]
  }
}

type Result = {
  title: string
  match: string[]
  path: string

  headings: Array<{
    text: string
    match: string[]
    paragraphs: Array<{
      text: string
      match: string[]
    }>
  }>

  /**
   * Note: May not be accurate since it currently depends on SEARCH_RESULTS_LIMIT,
   * which limits all but by score sorted results.
   */
  totalParagraphMatches: number
}

type SearchDoc = {
  id: number
  title: string
  path: string
  heading: string
  text: string
}

const SEARCH_RESULTS_LIMIT = 50

export const useSearchEngine = (
  type: SearchType,
  limit = SEARCH_RESULTS_LIMIT
) => {
  const [engine] = useState<Promise<MiniSearch<SearchDoc>>>(async () => {
    const miniSearch = new MiniSearch<SearchDoc>({
      fields: ['title', 'heading', 'text'], // fields to index for full-text search
      storeFields: ['title', 'heading', 'text', 'path'], // fields to return with search results
      searchOptions: {
        boost: { title: 2 },
        fuzzy: 0.2,
        prefix: true,
      },
    })

    if (typeof window === 'undefined') {
      return miniSearch
    }

    let docIndex: DocIndex[]
    switch (type) {
      case 'help':
        docIndex = (await import('../../../../../.contentlayer/en.json'))
          .default as unknown as DocIndex[]
        break
      case 'specs':
        docIndex = (await import('../../../../../.contentlayer/specs.en.json'))
          .default as unknown as DocIndex[]
        break
    }

    const docs: SearchDoc[] = []
    let id = 0

    for (const item of docIndex!) {
      for (const [heading, texts] of Object.entries(item.content)) {
        for (const text of texts) {
          docs.push({
            id: id++,
            title: item.title,
            path: item.path,
            heading,
            text,
          })
        }
      }
    }

    miniSearch.addAll(docs)

    return miniSearch
  })

  const [results, setResults] = useState<Result[]>([])

  const query = useCallback(
    async (term: string) => {
      const searchResults = (await engine)
        .search(term)
        .slice(0, limit) as SearchResult[]

      const results: Result[] = []
      for (const item of searchResults) {
        const matches = Object.entries(item.match).reduce<{
          title: string[]
          heading: string[]
          text: string[]
        }>(
          (acc, [term, fields]) => {
            if (fields.includes('title')) {
              acc.title.push(term)
            }

            if (fields.includes('heading')) {
              acc.heading.push(term)
            }

            if (fields.includes('text')) {
              acc.text.push(term)
            }

            return acc
          },
          {
            title: [],
            heading: [],
            text: [],
          }
        )

        const foundDocumentIndex = results.findIndex(
          result => result.title === item.title
        )
        const isNewDocumentMatch = foundDocumentIndex === -1

        // add new document match to results
        if (isNewDocumentMatch) {
          results.push({
            title: item.title,
            match: matches.title,
            path: item.path,
            headings: [
              {
                text: item.heading,
                match: matches.heading,
                paragraphs: [
                  {
                    text: item.text,
                    match: matches.text,
                  },
                ],
              },
            ],
            totalParagraphMatches: 1,
          })

          continue
        }

        const foundHeadingIndex = results[
          foundDocumentIndex
        ].headings.findIndex(({ text }) => text === item.heading)
        const isNewHeadingMatch = foundHeadingIndex === -1

        const foundParagraphMatch = Object.values(item.match).some(value =>
          value.includes('text')
        )

        // append new heading or paragraph match to preexisting document match
        if (isNewHeadingMatch || foundParagraphMatch) {
          results[foundDocumentIndex].totalParagraphMatches++
        }

        // append new heading match to preexisting document match
        if (isNewHeadingMatch) {
          results[foundDocumentIndex].headings.push({
            text: item.heading,
            match: matches.heading,
            paragraphs: [
              {
                text: item.text,
                match: matches.text,
              },
            ],
          })

          continue
        }

        if (!foundParagraphMatch) {
          continue
        }

        // append new paragraph match to preexisting heading match
        results[foundDocumentIndex].headings[foundHeadingIndex].paragraphs.push(
          {
            text: item.text,
            match: matches.text,
          }
        )
      }

      setResults(results)
    },
    [engine, limit]
  )

  return { results, query } as const
}
