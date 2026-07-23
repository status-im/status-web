const VALID_WORD_COUNTS = [12, 15, 18, 21, 24] as const

type WordCount = (typeof VALID_WORD_COUNTS)[number]

const DEFAULT_WORD_COUNT: WordCount = 12
const MAX_WORD_COUNT: WordCount = 24

const isValidWordCount = (count: number): count is WordCount =>
  VALID_WORD_COUNTS.includes(count as WordCount)

export {
  DEFAULT_WORD_COUNT,
  isValidWordCount,
  MAX_WORD_COUNT,
  VALID_WORD_COUNTS,
}
export type { WordCount }
