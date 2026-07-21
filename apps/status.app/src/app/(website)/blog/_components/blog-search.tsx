'use client'

import { useEffect, useRef, useState } from 'react'

import { Button, Text } from '@status-im/components'
import { ClearIcon, SearchIcon } from '@status-im/icons/20'
import Image from 'next/image'
import { useTranslations } from 'next-intl'

import { usePathname } from '~/i18n/navigation'

import { TAGS } from '../_tags'
import {
  BLOG_SEARCH_MAX_RESULTS,
  BLOG_SEARCH_QUERY_MAX_LENGTH,
  BLOG_SEARCH_RESULTS_PER_PAGE,
} from '../_utils/search-config'
import { HighlightedPostCard } from './highlighted-post-card'
import { InfinitePostGrid } from './infinite-post-grid'
import { PostGrid } from './post-grid'

import type { BlogSearchResults } from '../_utils/search-config'
import type { PostOrPage, PostsOrPages } from '@tryghost/content-api'

type Props = {
  initialPosts: PostOrPage[]
  meta: PostsOrPages['meta']
  /** Server-rendered results for the incoming URL, or null if none were produced. */
  initialResults: BlogSearchResults | null
  initialQuery: string
  initialCategory?: string
}

const URL_UPDATE_DELAY = 250
const SEARCH_DEBOUNCE_DELAY = 200

/** Identifies a search request so repeat and in-flight requests can be compared. */
const toRequestKey = (
  query: string,
  category: string | undefined,
  limit: number
) => `${query}|${category ?? ''}|${limit}`

export function BlogSearch(props: Props) {
  const { initialPosts, meta, initialResults, initialQuery, initialCategory } =
    props
  const t = useTranslations('blog')
  const pathname = usePathname()
  const [query, setQuery] = useState(initialQuery)
  const [category, setCategory] = useState(initialCategory)
  const [visibleResultCount, setVisibleResultCount] = useState(
    BLOG_SEARCH_RESULTS_PER_PAGE
  )
  const [results, setResults] = useState(initialResults)
  const [searchStatus, setSearchStatus] = useState<
    'idle' | 'loading' | 'ready' | 'error'
  >(initialResults ? 'ready' : 'idle')
  const selectedCategoryRef = useRef<HTMLButtonElement>(null)

  const normalizedQuery = query.trim()
  const [debouncedQuery, setDebouncedQuery] = useState(normalizedQuery)

  const isFiltering = normalizedQuery.length > 0 || Boolean(category)
  const isDebouncing = debouncedQuery !== normalizedQuery
  const requestKey = toRequestKey(debouncedQuery, category, visibleResultCount)
  const initialRequestKey = initialResults
    ? toRequestKey(
        initialQuery.trim(),
        initialCategory,
        BLOG_SEARCH_RESULTS_PER_PAGE
      )
    : null

  const resultPosts = results?.posts ?? []
  const resultCount = results?.total ?? 0
  // The API clamps `limit` to BLOG_SEARCH_MAX_RESULTS, so past that point
  // another request cannot return more posts; comparing against the raw total
  // would leave a "Load more" button that never makes progress.
  const canLoadMore =
    resultPosts.length < Math.min(resultCount, BLOG_SEARCH_MAX_RESULTS)
  const isSearchLoading =
    isFiltering && (isDebouncing || searchStatus === 'loading')
  const hasSearchError = isFiltering && searchStatus === 'error'
  const highlightedPost = initialPosts[0]

  useEffect(() => setQuery(initialQuery), [initialQuery])
  useEffect(() => setCategory(initialCategory), [initialCategory])
  useEffect(
    () => setVisibleResultCount(BLOG_SEARCH_RESULTS_PER_PAGE),
    [category, query]
  )
  useEffect(() => {
    if (!category) return

    selectedCategoryRef.current?.scrollIntoView({
      block: 'nearest',
      inline: 'center',
    })
  }, [category])

  useEffect(() => {
    const timeout = window.setTimeout(
      () => setDebouncedQuery(normalizedQuery),
      SEARCH_DEBOUNCE_DELAY
    )

    return () => window.clearTimeout(timeout)
  }, [normalizedQuery])

  useEffect(() => {
    if (!debouncedQuery && !category) return

    // The server already rendered exactly this request; reuse it rather than
    // asking for the same thing again on mount (or on returning to it).
    if (requestKey === initialRequestKey) {
      setResults(initialResults)
      setSearchStatus('ready')
      return
    }

    const controller = new AbortController()
    setSearchStatus('loading')

    const params = new URLSearchParams({ limit: String(visibleResultCount) })
    if (debouncedQuery) params.set('q', debouncedQuery)
    if (category) params.set('category', category)

    fetch(`/api/blog/search?${params}`, { signal: controller.signal })
      .then(response => {
        if (!response.ok) {
          throw new Error(`Blog search responded with ${response.status}`)
        }

        return response.json() as Promise<BlogSearchResults>
      })
      .then(data => {
        setResults(data)
        setSearchStatus('ready')
      })
      .catch((error: unknown) => {
        // Superseded by a newer keystroke, not a failure.
        if (controller.signal.aborted) return

        console.error('Failed to search blog posts:', error)
        setSearchStatus('error')
      })

    return () => controller.abort()
  }, [
    category,
    debouncedQuery,
    initialRequestKey,
    initialResults,
    requestKey,
    visibleResultCount,
  ])

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      const params = new URLSearchParams()
      if (normalizedQuery) params.set('q', normalizedQuery)
      if (category) params.set('category', category)

      const queryString = params.toString()
      const nextUrl = queryString ? `${pathname}?${queryString}` : pathname
      const currentUrl = `${window.location.pathname}${window.location.search}`

      if (currentUrl !== nextUrl) {
        window.history.replaceState(window.history.state, '', nextUrl)
      }
    }, URL_UPDATE_DELAY)

    return () => window.clearTimeout(timeout)
  }, [category, normalizedQuery, pathname])

  const clearFilters = () => {
    setQuery('')
    setCategory(undefined)
  }

  return (
    <>
      <div className="relative mb-4 max-w-[720px]">
        <SearchIcon className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-neutral-50" />
        <input
          type="search"
          value={query}
          maxLength={BLOG_SEARCH_QUERY_MAX_LENGTH}
          onChange={event => setQuery(event.target.value)}
          placeholder={t('searchPlaceholder')}
          aria-label={t('searchLabel')}
          className="h-14 w-full rounded-16 border border-neutral-30 bg-white-100 px-12 text-19 text-neutral-100 outline-none transition-colors placeholder:text-neutral-40 hover:border-neutral-40 focus:border-neutral-50 focus-visible:ring-2 focus-visible:ring-customisation-50 focus-visible:ring-offset-2 [&::-webkit-search-cancel-button]:hidden"
        />
        {query && (
          <button
            type="button"
            onClick={() => setQuery('')}
            aria-label={t('clearSearch')}
            className="absolute right-4 top-1/2 flex size-6 -translate-y-1/2 items-center justify-center rounded-8 text-neutral-50 outline-none hover:bg-neutral-10 focus-visible:ring-2 focus-visible:ring-customisation-50"
          >
            <ClearIcon />
          </button>
        )}
      </div>

      <div className="relative">
        <div
          role="group"
          className="-ml-5 -mr-8 flex gap-2 overflow-x-auto pb-12 pl-5 pr-8 scrollbar-none"
          aria-label={t('categoryFilterLabel')}
        >
          {Object.values(TAGS).map(({ slug, icon, name }) => {
            const isSelected = category === slug

            return (
              <button
                type="button"
                key={slug}
                ref={isSelected ? selectedCategoryRef : undefined}
                aria-pressed={isSelected}
                onClick={() => setCategory(isSelected ? undefined : slug)}
                className={`flex h-[32px] shrink-0 select-none items-center gap-2 rounded-10 border border-solid pl-2 pr-3 text-neutral-100 shadow-1 outline-none transition-colors focus-visible:ring-2 focus-visible:ring-customisation-50 focus-visible:ring-offset-2 ${
                  isSelected
                    ? 'border-neutral-100 bg-neutral-100 text-white-100'
                    : 'border-neutral-30 bg-white-100 active:border-neutral-50 hover:border-neutral-40'
                }`}
              >
                {icon}
                <Text size={15} weight="medium">
                  {name}
                </Text>
              </button>
            )
          })}
        </div>

        <div
          aria-hidden="true"
          className="pointer-events-none absolute -left-5 top-0 size-8 bg-gradient-to-r from-white-100 to-transparent md:hidden"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-8 top-0 h-8 w-10 bg-gradient-to-l from-white-100 to-transparent md:hidden"
        />
      </div>

      {isFiltering ? (
        <div>
          <div className="mb-5 flex items-center justify-between gap-4">
            <div role="status" aria-live="polite" aria-atomic="true">
              <Text size={15} color="$neutral-50">
                {isSearchLoading
                  ? t('searchLoading')
                  : t('resultCount', { count: resultCount })}
              </Text>
            </div>
            <Button size="32" variant="ghost" onPress={clearFilters}>
              {t('clearFilters')}
            </Button>
          </div>

          {hasSearchError ? (
            <div
              role="alert"
              className="flex min-h-[320px] flex-col items-center justify-center text-center"
            >
              <Text size={19} weight="semibold">
                {t('searchUnavailableTitle')}
              </Text>
              <div className="pb-1" />
              <Text size={15} color="$neutral-50">
                {t('searchUnavailableDescription')}
              </Text>
            </div>
          ) : resultPosts.length > 0 ? (
            // Kept on screen while a follow-up request is in flight, so typing
            // does not flash the grid back to skeletons on every keystroke.
            <>
              <PostGrid posts={resultPosts} isLoading={false} showExcerpt />
              {canLoadMore && (
                <div className="mt-8 flex justify-center">
                  <Button
                    size="40"
                    variant="outline"
                    onPress={() =>
                      setVisibleResultCount(
                        count => count + BLOG_SEARCH_RESULTS_PER_PAGE
                      )
                    }
                  >
                    {t('loadMore')}
                  </Button>
                </div>
              )}
            </>
          ) : isSearchLoading ? (
            <PostGrid posts={[]} isLoading />
          ) : (
            <div className="flex min-h-[320px] flex-col items-center justify-center text-center">
              <Image
                alt=""
                src="/assets/chart/empty.png"
                width={80}
                height={80}
              />
              <div className="pb-3" />
              <Text size={19} weight="semibold">
                {t('noResultsTitle')}
              </Text>
              <div className="pb-1" />
              <Text size={15} color="$neutral-50">
                {t('noResultsDescription')}
              </Text>
              <div className="pb-5" />
              <Button size="32" variant="outline" onPress={clearFilters}>
                {t('clearFilters')}
              </Button>
            </div>
          )}
        </div>
      ) : initialPosts.length > 0 ? (
        <div>
          <div className="mb-[44px] 2xl:mb-12">
            {highlightedPost && <HighlightedPostCard post={highlightedPost} />}
          </div>

          <InfinitePostGrid
            type="posts"
            initialPosts={initialPosts}
            meta={meta}
            queryKey="all"
            skip={1}
          />
        </div>
      ) : (
        <div className="flex min-h-[320px] flex-col items-center justify-center text-center">
          <Text size={19} weight="semibold">
            {t('emptyTitle')}
          </Text>
          <div className="pb-1" />
          <Text size={15} color="$neutral-50">
            {t('emptyDescription')}
          </Text>
        </div>
      )}
    </>
  )
}
