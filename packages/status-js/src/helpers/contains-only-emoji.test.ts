import { containsOnlyEmoji } from './contains-only-emoji'

describe('hasOnlyEmoji', () => {
  it('should be truthy', () => {
    expect(containsOnlyEmoji('💩')).toBeTruthy()
    expect(containsOnlyEmoji('💩💩💩💩💩💩')).toBeTruthy()
  })

  it('should be falsy', () => {
    expect(containsOnlyEmoji('')).toBeFalsy()
    expect(containsOnlyEmoji(' ')).toBeFalsy()
    expect(containsOnlyEmoji(' 💩')).toBeFalsy()
    expect(containsOnlyEmoji('💩 ')).toBeFalsy()
    expect(containsOnlyEmoji('text 💩')).toBeFalsy()
    expect(containsOnlyEmoji('💩 text')).toBeFalsy()
  })
})
