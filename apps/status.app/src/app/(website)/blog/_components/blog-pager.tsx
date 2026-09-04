'use client'

import { useEffect, useState } from 'react'

import { cx } from 'class-variance-authority'
import { useTranslations } from 'next-intl'

import { Link } from '~components/link'

/** Numbered links rendered either side of the current page. */
const ADJACENT_PAGE_COUNT = 2

const PAGER_STYLES = 'mt-10 flex justify-center'

/**
 * Out of the layout but still in the DOM and the accessibility tree, and back
 * on screen as soon as a keyboard reaches it, so tabbing never lands on a
 * control nobody can see.
 */
const HIDDEN_PAGER_STYLES = cx(
  'sr-only',
  'focus-within:not-sr-only focus-within:mt-10 focus-within:flex focus-within:justify-center'
)

type Props = {
  /** Archive root, e.g. `/blog` or `/blog/tag/privacy`. Page 1 lives here. */
  basePath: string
  currentPage: number
  totalPages: number
  /**
   * Visually hide the pager once React has hydrated.
   *
   * The archive roots load more posts by scrolling, which a crawler never
   * does, so without this every post past the first page has no link pointing
   * at it. The pager is rendered on the server for crawlers and no-JS
   * visitors, then stays in the DOM visually hidden after mount, so crawlers
   * that render JavaScript and anyone navigating by keyboard or screen reader
   * keep a path through the archive while the infinite scroll everyone else
   * sees is left untouched.
   */
  hideWhenInteractive?: boolean
}

export const BlogPager = (props: Props) => {
  const {
    basePath,
    currentPage,
    totalPages,
    hideWhenInteractive = false,
  } = props

  const t = useTranslations('blog')
  const [isInteractive, setIsInteractive] = useState(false)

  useEffect(() => {
    // Continuation pages keep the pager for good, so there is nothing to
    // track there and no reason to spend a render on it.
    if (!hideWhenInteractive) {
      return
    }

    setIsInteractive(true)
  }, [hideWhenInteractive])

  if (totalPages <= 1) {
    return null
  }

  const isVisuallyHidden = hideWhenInteractive && isInteractive

  const itemStyles =
    'flex h-8 min-w-8 items-center justify-center rounded-10 px-2 text-15 font-medium'

  return (
    <nav
      aria-label={t('paginationLabel')}
      className={isVisuallyHidden ? HIDDEN_PAGER_STYLES : PAGER_STYLES}
    >
      <ul className="flex flex-wrap items-center justify-center gap-1">
        {currentPage > 1 && (
          <li>
            <Link
              href={pageHref(basePath, currentPage - 1)}
              rel="prev"
              className={cx(itemStyles, 'text-neutral-100 hover:bg-neutral-5')}
            >
              {t('previousPage')}
            </Link>
          </li>
        )}

        {getVisiblePages(currentPage, totalPages).map((page, index) => {
          if (page === 'gap') {
            return (
              <li
                key={`gap-${index}`}
                aria-hidden
                className={cx(itemStyles, 'text-neutral-50')}
              >
                &hellip;
              </li>
            )
          }

          if (page === currentPage) {
            return (
              <li key={page}>
                <span
                  aria-current="page"
                  className={cx(itemStyles, 'bg-neutral-10 text-neutral-100')}
                >
                  {page}
                </span>
              </li>
            )
          }

          return (
            <li key={page}>
              <Link
                href={pageHref(basePath, page)}
                className={cx(
                  itemStyles,
                  'text-neutral-100 hover:bg-neutral-5'
                )}
              >
                {page}
              </Link>
            </li>
          )
        })}

        {currentPage < totalPages && (
          <li>
            <Link
              href={pageHref(basePath, currentPage + 1)}
              rel="next"
              className={cx(itemStyles, 'text-neutral-100 hover:bg-neutral-5')}
            >
              {t('nextPage')}
            </Link>
          </li>
        )}
      </ul>
    </nav>
  )
}

/** Page 1 is the archive root itself, so it never gets a `/page/1` URL. */
export function pageHref(basePath: string, page: number): string {
  return page === 1 ? basePath : `${basePath}/page/${page}`
}

function getVisiblePages(
  currentPage: number,
  totalPages: number
): Array<number | 'gap'> {
  const pages = new Set<number>([1, totalPages])

  for (
    let page = currentPage - ADJACENT_PAGE_COUNT;
    page <= currentPage + ADJACENT_PAGE_COUNT;
    page++
  ) {
    if (page >= 1 && page <= totalPages) {
      pages.add(page)
    }
  }

  const visible: Array<number | 'gap'> = []
  let previous = 0

  for (const page of [...pages].sort((a, b) => a - b)) {
    if (previous > 0 && page - previous > 1) {
      visible.push('gap')
    }

    visible.push(page)
    previous = page
  }

  return visible
}
