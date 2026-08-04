import { useCallback, useEffect, useRef, useState } from 'react'

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

/**
 * Deadline for the idle callback that warms the index, so the build still
 * happens promptly on browsers that stay busy after the dialog opens.
 */
const ENGINE_WARMUP_TIMEOUT_MS = 500

const loadDocIndex = async (type: SearchType): Promise<DocIndex[]> => {
  switch (type) {
    case 'help':
      return (await import('../../../../../.contentlayer/en.json'))
        .default as unknown as DocIndex[]
    case 'specs':
      return (await import('../../../../../.contentlayer/specs.en.json'))
        .default as unknown as DocIndex[]
  }
}

const createSearchEngine = async (
  type: SearchType
): Promise<MiniSearch<SearchDoc>> => {
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

  const docIndex = await loadDocIndex(type)

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
}

const whenIdle = (callback: () => void): (() => void) => {
  if (typeof window.requestIdleCallback !== 'function') {
    const timeoutId = window.setTimeout(callback, 0)
    return () => window.clearTimeout(timeoutId)
  }

  const handle = window.requestIdleCallback(callback, {
    timeout: ENGINE_WARMUP_TIMEOUT_MS,
  })
  return () => window.cancelIdleCallback(handle)
}

type Options = {
  /**
   * Whether the index may be built. The doc index is ~540KB and indexing it
   * blocks the main thread for hundreds of milliseconds on mobile, so callers
   * enable it only once the user reaches for search — never on page load.
   */
  enabled?: boolean
  limit?: number
}

export const useSearchEngine = (type: SearchType, options: Options = {}) => {
  const { enabled = true, limit = SEARCH_RESULTS_LIMIT } = options

  const engineRef = useRef<Promise<MiniSearch<SearchDoc>> | null>(null)

  const loadEngine = useCallback((): Promise<MiniSearch<SearchDoc>> => {
    engineRef.current ??= createSearchEngine(type)

    return engineRef.current
  }, [type])

  // Warm the index once search is reachable, but off the interaction that
  // opened it, so building it never delays the dialog's first paint.
  useEffect(() => {
    if (!enabled) {
      return
    }

    return whenIdle(() => {
      void loadEngine()
    })
  }, [enabled, loadEngine])

  const [results, setResults] = useState<Result[]>([])

  const query = useCallback(
    async (term: string) => {
      const normalizedTerm = term.trim()

      if (normalizedTerm === '') {
        setResults([])
        return
      }

      const searchResults = (await loadEngine())
        .search(normalizedTerm)
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
    [loadEngine, limit]
  )

  return { results, query } as const
}
