import { jsonLD } from './json-ld'

import type { FAQPageSchema, JSONLDSchema } from '@status-im/components'

const STATUS_SITE_URL = 'https://status.app'
const STATUS_LOGO_URL = `${STATUS_SITE_URL}/icon.png`

export type FAQItem = {
  question: string
  answer: string
}

type HelpDocStructuredDataInput = {
  title: string
  raw: string
  lastEdited?: string | Date
  author?: string
  image?: {
    src: string
  }
}

type LandingPageStructuredDataInput = {
  name: string
  description?: string
  path: string
}

export function buildHelpDocStructuredData(
  input: HelpDocStructuredDataInput
): JSONLDSchema[] {
  const dateModified = input.lastEdited
    ? normalizeDate(input.lastEdited)
    : undefined
  const faqItems = extractFAQItemsFromMarkdown(input.raw, {
    title: input.title,
  })
  const schema: JSONLDSchema[] = [
    jsonLD.article({
      headline: input.title,
      description: getMarkdownExcerpt(input.raw),
      image: input.image ? toAbsoluteStatusUrl(input.image.src) : undefined,
      // `lastEdited` is a modification timestamp, not a publish date. Omit
      // `datePublished` rather than derive it from the modified date, which
      // would produce inaccurate Article structured data.
      dateModified,
      author: {
        name: getPrimaryAuthor(input.author),
        type: 'Person',
      },
      publisher: {
        name: 'Status',
        logo: STATUS_LOGO_URL,
      },
    }),
  ]

  const faqSchema = buildFAQStructuredData(faqItems)

  if (faqSchema) {
    schema.push(faqSchema)
  }

  return schema
}

export function buildLandingPageStructuredData(
  input: LandingPageStructuredDataInput
): JSONLDSchema {
  return jsonLD.webpage({
    name: input.name,
    description: input.description,
    url: toAbsoluteStatusUrl(input.path),
  })
}

export function buildFAQStructuredData(
  faqItems: FAQItem[]
): FAQPageSchema | null {
  if (faqItems.length === 0) {
    return null
  }

  return jsonLD.faqPage({
    questions: faqItems,
  })
}

export function extractFAQItemsFromMarkdown(
  markdown: string,
  options: { title?: string } = {}
): FAQItem[] {
  const lines = removeFrontmatter(markdown).split('\n')
  const isDedicatedFAQArticle = isFAQSectionHeading(options.title ?? '')
  const faqItems: FAQItem[] = []
  let isInFAQSection = isDedicatedFAQArticle
  let isInCodeFence = false
  let currentQuestion: string | null = null
  let currentAnswerLines: string[] = []

  for (const line of lines) {
    if (/^\s*```/.test(line)) {
      isInCodeFence = !isInCodeFence
      if (currentQuestion) {
        currentAnswerLines.push(line)
      }
      continue
    }

    // A `#`-prefixed line inside a fenced code block (e.g. a shell/YAML
    // comment) is code content, not a markdown heading.
    const heading = isInCodeFence ? null : line.match(/^(#{1,6})\s+(.+?)\s*#*$/)

    if (!heading) {
      if (currentQuestion) {
        currentAnswerLines.push(line)
      }
      continue
    }

    const level = heading[1].length
    const headingText = cleanMarkdownText(heading[2])

    if (level <= 2) {
      flushFAQItem()
      // For a dedicated FAQ article (title matches the FAQ regex), every H2
      // is treated as FAQ content, including ones that aren't themselves
      // FAQ-labeled (e.g. category groupings like "## About Status Wallet").
      // This assumes the whole article is FAQ content, which holds for the
      // current help-docs corpus but would misclassify H3s under an
      // unrelated trailing H2 (e.g. "## Related articles") in a doc that
      // otherwise qualifies as a dedicated FAQ article.
      isInFAQSection = isDedicatedFAQArticle || isFAQSectionHeading(headingText)
      continue
    }

    if (level === 3 && isInFAQSection) {
      flushFAQItem()
      currentQuestion = headingText
      currentAnswerLines = []
      continue
    }

    if (currentQuestion) {
      currentAnswerLines.push(line)
    }
  }

  flushFAQItem()

  return faqItems

  function flushFAQItem() {
    if (!currentQuestion) {
      return
    }

    const answer = cleanMarkdownText(currentAnswerLines.join('\n'))

    if (answer) {
      faqItems.push({
        question: currentQuestion,
        answer,
      })
    }

    currentQuestion = null
    currentAnswerLines = []
  }
}

function isFAQSectionHeading(heading: string): boolean {
  return (
    /\bfaqs?\b/i.test(heading) ||
    /\bfrequently asked questions\b/i.test(heading) ||
    /^common questions$/i.test(heading)
  )
}

function getMarkdownExcerpt(markdown: string): string | undefined {
  // Discard heading blocks on the raw markdown first. `cleanMarkdownText`
  // strips leading `#` markers, so filtering after cleaning would let a
  // heading (e.g. `# Title`) slip through as the excerpt/Article description.
  const firstParagraph = removeFrontmatter(markdown)
    .split(/\n{2,}/)
    .map(block => block.trim())
    .filter(block => block.length > 0 && !block.startsWith('#'))
    .map(cleanMarkdownText)
    .find(Boolean)

  return firstParagraph
}

export function parseAuthors(author: string | undefined): string[] {
  return (author ?? '')
    .split(',')
    .map(item => item.trim())
    .filter(Boolean)
}

function getPrimaryAuthor(author: string | undefined): string {
  return parseAuthors(author)[0] ?? 'Status'
}

function normalizeDate(date: string | Date): string {
  return typeof date === 'string' ? date : date.toISOString()
}

function toAbsoluteStatusUrl(url: string): string {
  if (url.startsWith('http')) {
    return url
  }

  return `${STATUS_SITE_URL}${url.startsWith('/') ? url : `/${url}`}`
}

function removeFrontmatter(markdown: string): string {
  return markdown.replace(/^---[\s\S]*?---\s*/, '')
}

function cleanMarkdownText(markdown: string): string {
  return markdown
    .replace(/\{\/\*[\s\S]*?\*\/\}/g, '')
    .replace(/!\[[^\]]*]\([^)]*\)/g, '')
    .replace(/\[([^\]]+)]\([^)]*\)/g, '$1')
    .replace(/<\/?[^>]+>/g, ' ')
    .replace(/^#{1,6}\s+/gm, '')
    .replace(/^[*-]\s+/gm, '')
    .replace(/^\d+\.\s+/gm, '')
    .replace(/[`*_~]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
}
