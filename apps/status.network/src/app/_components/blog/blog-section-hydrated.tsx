'use client'

import { useEffect, useState } from 'react'
import { type HomepageBlogCard } from '../../_lib/ghost-client'
import { fetchHomepageNaverBlogCards } from '../../_lib/naver-client'
import { ButtonLink } from '../button-link'
import { BlogCard } from './blog-card'

type BlogSource = 'ghost' | 'naver'

type Props = {
  initialCards: HomepageBlogCard[]
  source: BlogSource
  viewBlogHref: string
  title: string
  viewBlogLabel: string
}

function cardsEqual(a: HomepageBlogCard[], b: HomepageBlogCard[]): boolean {
  return JSON.stringify(a) === JSON.stringify(b)
}

export function BlogSectionHydrated({
  initialCards,
  source,
  viewBlogHref,
  title,
  viewBlogLabel,
}: Props) {
  const [cards, setCards] = useState(initialCards)

  useEffect(() => {
    let cancelled = false

    async function refresh() {
      if (source === 'ghost') {
        return
      }

      try {
        const fresh = await fetchHomepageNaverBlogCards()

        if (cancelled || fresh.length === 0) {
          return
        }

        setCards(current => (cardsEqual(current, fresh) ? current : fresh))
      } catch {
        // Keep build-time snapshot on failure.
      }
    }

    void refresh()

    return () => {
      cancelled = true
    }
  }, [source])

  return (
    <section className="w-full" id="blog">
      <div className="px-5 py-[120px] lg:px-[120px] lg:py-[168px]">
        <div className="flex items-center justify-between">
          <h2 className="text-27 font-600">{title}</h2>
          <ButtonLink variant="white" size="32" href={viewBlogHref}>
            {viewBlogLabel}
          </ButtonLink>
        </div>
        {cards.length > 0 && (
          <div className="mt-6 grid gap-6 md:grid-cols-2 lg:mt-12 lg:grid-cols-3">
            {cards.map(card => (
              <BlogCard key={card.link} {...card} />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
