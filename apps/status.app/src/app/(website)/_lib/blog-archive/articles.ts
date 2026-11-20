import articles from './bodies.json'

import type { BlogFAQItem } from '~website/blog/_utils/faq'

type Article = {
  html: string
  faqItems?: BlogFAQItem[]
}

const archive: Record<string, Article> = articles

export function getArchivedArticle(slug: string) {
  return archive[slug]
}
