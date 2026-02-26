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
