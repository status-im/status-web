'use client'

import { useEffect, useMemo, useRef } from 'react'

import { useInfiniteQuery } from '@tanstack/react-query'
import { match } from 'ts-pattern'

import { useIntersectionObserver } from '~hooks/use-intersection-observer'
import {
  getPosts,
  getPostsByAuthorSlug,
  getPostsByTagSlug,
} from '~website/_lib/ghost'

import { PostGrid } from './post-grid'

import type { PostOrPage, PostsOrPages } from '@tryghost/content-api'

type Props = {
  type: 'posts' | 'author' | 'tag'
  initialPosts: PostOrPage[]
  meta: PostsOrPages['meta']
  queryKey: string
  skip?: number
}

function useInfiniteLoading({
  rootMargin,
  fetchNextPage,
  isFetchingNextPage,
  hasNextPage,
}: {
  rootMargin: string
  fetchNextPage: () => void
  isFetchingNextPage: boolean
  hasNextPage?: boolean
}) {
  const endOfPageRef = useRef<HTMLDivElement>(null)
  const entry = useIntersectionObserver(endOfPageRef, {
    rootMargin,
  })

  const isVisible = !!entry?.isIntersecting
  const isLoading = (hasNextPage && isVisible) || isFetchingNextPage

  useEffect(() => {
    if (isVisible && !isFetchingNextPage && hasNextPage) {
      fetchNextPage()
    }
  }, [fetchNextPage, hasNextPage, isFetchingNextPage, isVisible])

  return {
    endOfPageRef,
    isLoading,
  }
}

export const InfinitePostGrid = (props: Props) => {
  const { initialPosts, type, meta, queryKey, skip = 0 } = props

  const {
    data,
    // error,
    fetchNextPage,
    hasNextPage,
    // isFetching,
    isFetchingNextPage,
    // status,
    // isFetched,
  } = useInfiniteQuery({
    refetchOnWindowFocus: false,
    queryKey: queryKey ? ['posts', queryKey] : ['posts'],
    queryFn: async ({ pageParam: page, queryKey }) => {
      const [, tag] = queryKey

      const response = await match(type)
        .with('posts', () => getPosts({ page }))
        .with('author', () => getPostsByAuthorSlug(tag, page))
        .with('tag', () => getPostsByTagSlug(tag, page))
        .exhaustive()

      return response!
    },
    getNextPageParam: ({ meta }) => meta.pagination.next,
    initialData: { pages: [{ posts: initialPosts, meta }], pageParams: [1] },
    initialPageParam: 1,
    staleTime: Infinity,
  })

  const { endOfPageRef, isLoading } = useInfiniteLoading({
    rootMargin: '-100px',
    fetchNextPage,
    isFetchingNextPage,
    hasNextPage,
  })

  const allPosts = useMemo(() => {
    return data.pages.flatMap(posts => posts?.posts ?? []).slice(skip)
  }, [data.pages, skip])

  if (allPosts.length === 0) {
    return
  }

  return (
    <>
      <PostGrid
        posts={allPosts}
        isLoading={isLoading}
        hasNextPage={hasNextPage}
      />
      <div ref={endOfPageRef} />
    </>
  )
}
