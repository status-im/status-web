export type BlogFAQItem = {
  question: string
  answer: string
}

// Ghost post-level FAQ source:
// <script id="status-faq" type="application/json">
//   {"questions":[{"question":"...","answer":"..."}]}
// </script>
const FAQ_SCRIPT_ID = 'status-faq'
const FAQ_SCRIPT_PATTERN = new RegExp(
  `<script[^>]*id=(["'])${FAQ_SCRIPT_ID}\\1[^>]*>([\\s\\S]*?)<\\/script>`,
  'i',
)

export function getPostFAQItems(
  codeInjectionHead?: string | null,
  codeInjectionFoot?: string | null,
): BlogFAQItem[] {
  const fromHead = parseFAQFromCodeInjection(codeInjectionHead)
  if (fromHead.length > 0) {
    return fromHead
  }

  return parseFAQFromCodeInjection(codeInjectionFoot)
}

function parseFAQFromCodeInjection(
  codeInjection?: string | null,
): BlogFAQItem[] {
  if (!codeInjection) {
    return []
  }

  const scriptContent = extractFAQScriptContent(codeInjection)
  if (!scriptContent) {
    return []
  }

  let parsed: unknown
  try {
    parsed = JSON.parse(scriptContent)
  } catch {
    return []
  }

  return getFAQItems(parsed)
}

function extractFAQScriptContent(codeInjection: string): string | null {
  const match = codeInjection.match(FAQ_SCRIPT_PATTERN)
  if (!match?.[2]) {
    return null
  }

  return match[2].trim()
}

function getFAQItems(payload: unknown): BlogFAQItem[] {
  const questions = extractQuestions(payload)

  return questions
    .map(item => {
      if (!isRecord(item)) {
        return null
      }

      const question = normalizeText(item['question'])
      const answer = normalizeText(item['answer'])

      if (!question || !answer) {
        return null
      }

      return { question, answer }
    })
    .filter((item): item is BlogFAQItem => item !== null)
}

function extractQuestions(payload: unknown): unknown[] {
  if (Array.isArray(payload)) {
    return payload
  }

  if (!isRecord(payload)) {
    return []
  }

  if (Array.isArray(payload['questions'])) {
    return payload['questions']
  }

  if (Array.isArray(payload['faq'])) {
    return payload['faq']
  }

  return []
}

function normalizeText(value: unknown): string {
  if (typeof value !== 'string') {
    return ''
  }

  return value
    .replace(/<[^>]*>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

// Extract JSON-LD from Ghost code injection.
// Supports both:
//   1. <script type="application/ld+json">{...}</script>
//   2. Raw JSON objects with "@context" and "@type" (pasted directly in Ghost)
const JSON_LD_SCRIPT_PATTERN =
  /<script[^>]*type=(["'])application\/ld\+json\1[^>]*>([\s\S]*?)<\/script>/gi

export function getCodeInjectionJsonLd(
  codeInjectionHead?: string | null,
  codeInjectionFoot?: string | null,
): string[] {
  const results: string[] = []

  for (const source of [codeInjectionHead, codeInjectionFoot]) {
    if (!source) continue

    // Try extracting from <script> tags first
    const pattern = new RegExp(JSON_LD_SCRIPT_PATTERN.source, 'gi')
    let match: RegExpExecArray | null
    while ((match = pattern.exec(source)) !== null) {
      const content = match[2]?.trim()
      if (content) {
        try {
          JSON.parse(content)
          results.push(content)
        } catch {
          // skip invalid JSON
        }
      }
    }

    // If no script tags found, try parsing the source as raw JSON-LD
    if (results.length === 0) {
      const trimmed = source.trim()
      if (trimmed.startsWith('{')) {
        try {
          const parsed = JSON.parse(trimmed)
          if (parsed['@context'] && parsed['@type']) {
            results.push(trimmed)
          }
        } catch {
          // not valid JSON
        }
      }
    }
  }

  return results
}
