import { expect, test } from 'vitest'

import { containsOnlyEmoji } from './contains-only-emoji'

test('should be truthy', () => {
  expect(containsOnlyEmoji('💩')).toBeTruthy()
  expect(containsOnlyEmoji('💩💩💩💩💩💩')).toBeTruthy()
})

test('should be falsy', () => {
  expect(containsOnlyEmoji('')).toBeFalsy()
  expect(containsOnlyEmoji(' ')).toBeFalsy()
  expect(containsOnlyEmoji(' 💩')).toBeFalsy()
  expect(containsOnlyEmoji('💩 ')).toBeFalsy()
  expect(containsOnlyEmoji('text 💩')).toBeFalsy()
  expect(containsOnlyEmoji('💩 text')).toBeFalsy()
})
