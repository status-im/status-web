import { describe, expect, it } from 'vitest'

import { containsOnlyEmoji } from './contains-only-emoji'

describe('containsOnlyEmoji', () => {
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
