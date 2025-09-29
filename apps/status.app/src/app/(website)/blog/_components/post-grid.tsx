'use client'

import { useEffect, useRef, useState } from 'react'

import { PostCard, PostCardSkeleton } from './post-card'

import type { PostOrPage } from '@tryghost/content-api'

export function PostGrid({
  posts,
  isLoading,
  hasNextPage,
}: {
  posts: PostOrPage[]
  isLoading: boolean
  hasNextPage?: boolean
}) {
  const gridRef = useRef<HTMLDivElement | null>(null)
  const [columnCount, setColumnCount] = useState(1)

  useEffect(() => {
    const ref = gridRef.current!

    const resizeObserver = new ResizeObserver(() => {
      const gridSize = ref.clientWidth
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      // const itemSize = ref.firstChild.offsetWidth
      // const itemSize = ref.firstChild.clientWidth
      const itemSize = parseFloat(window.getComputedStyle(ref.firstChild).width)
      // const gapSize = parseInt(window.getComputedStyle(ref).gap, 10)
      const gapSize = parseFloat(window.getComputedStyle(ref).gap)

      // example: Math.floor((719-(350*Math.floor(719/350)))/20) + 1
      const gapCount = Math.floor(
        (gridSize - itemSize * Math.floor(gridSize / itemSize)) / gapSize
      )
      const columnCount = gapCount + 1

      setColumnCount(columnCount)
    })

    resizeObserver.observe(ref)

    return () => {
      resizeObserver.unobserve(ref)
    }
  }, [])

  let visiblePosts
  if (hasNextPage) {
    const wrappedPostCount = posts.length - (posts.length % columnCount)
    visiblePosts = posts.slice(0, wrappedPostCount)
  } else {
    visiblePosts = posts
  }

  return (
    <div
      ref={gridRef}
      className="grid auto-rows-[1fr] grid-cols-[repeat(auto-fill,minmax(350px,1fr))] gap-5"
    >
      {visiblePosts.map(post => (
        <PostCard key={post.id} post={post} />
      ))}
      {isLoading && (
        <>
          {Array.from({ length: columnCount }).map((_, index) => (
            <PostCardSkeleton key={index} />
          ))}
        </>
      )}
    </div>
  )
}
