import { useCallback, useState } from 'react'

import MiniSearch from 'minisearch'

import type { DocIndex } from 'contentlayer.config'
import type { SearchResult as MiniSearchResult } from 'minisearch'

type SearchResult = MiniSearchResult & {
  title: string
  heading: string
  text: string
  path: string
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
}

type SearchDoc = {
  id: number
  title: string
  path: string
  heading: string
  text: string
}

export const useSearchEngine = (limit = 5) => {
  const [engine] = useState<Promise<MiniSearch<SearchDoc>>>(async () => {
    const miniSearch = new MiniSearch<SearchDoc>({
      fields: ['title', 'heading', 'text'], // fields to index for full-text search
      storeFields: ['title', 'heading', 'text', 'path'], // fields to return with search results
      searchOptions: {
        fuzzy: 0.25,
        prefix: true,
      },
    })

    if (typeof window === 'undefined') {
      return miniSearch
    }

    const docIndex = (await import('../../.contentlayer/en.json'))
      .default as unknown as DocIndex[]

    const docs: SearchDoc[] = []
    let id = 0

    for (const item of docIndex) {
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
        // results[item.title] ??= {  }
        // results[item.title][item.heading] ??= []
        // results[item.title][item.heading].push({
        //   text: item.text,
        //   match: item.match,
        // })

        const foundIndex = results.findIndex(
          result => result.title === item.title
        )

        const matches = Object.entries(item.match).reduce<{
          title: string[]
          heading: string[]
          text: string[]
        }>(
          (acc, [term, fields]) => {
            fields.includes('title') && acc.title.push(term)
            fields.includes('heading') && acc.heading.push(term)
            fields.includes('text') && acc.text.push(term)
            return acc
          },
          {
            title: [],
            heading: [],
            text: [],
          }
        )

        if (foundIndex === -1) {
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
          })
        } else {
          const foundHeadingIndex = results[foundIndex].headings.findIndex(
            ({ text }) => text === item.heading
          )

          if (foundHeadingIndex === -1) {
            results[foundIndex].headings.push({
              text: item.heading,
              match: matches.heading,
              paragraphs: [
                {
                  text: item.text,
                  match: matches.text,
                },
              ],
            })
          } else {
            results[foundIndex].headings[foundHeadingIndex].paragraphs.push({
              text: item.text,
              match: matches.text,
            })
          }
        }
      }

      setResults(results)
    },
    [engine, limit]
  )

  return { results, query } as const
}
