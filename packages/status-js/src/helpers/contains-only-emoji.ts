// todo?: should ignore whitespaces with replace(/\s+/g, '').trim()
/**
 * https://www.unicode.org/reports/tr51/#def_emoji_presentation
 */
export function containsOnlyEmoji(text: string): boolean {
  return /^\p{Emoji_Presentation}+$/gu.test(text)
}
