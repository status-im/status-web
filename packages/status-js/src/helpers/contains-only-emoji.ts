// todo?: should ignore whitespaces with replace(/\s+/g, '').trim()
export function containsOnlyEmoji(text: string): boolean {
  return /^\p{Emoji}+$/gu.test(text)
}
