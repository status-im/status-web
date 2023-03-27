import { expect, test } from 'vitest'

import { indicesToTags } from './indices-to-tags'

test('should return tags for indices', () => {
  expect(indicesToTags([1, 2, 3])).toEqual([
    ['Art', '🎨'],
    ['Blockchain', '🔗'],
    ['Books & blogs', '📚'],
  ])
})

test('should not return tags for no indices', () => {
  expect(indicesToTags([])).toEqual([])
})

test('should not return tags for unknown indices', () => {
  expect(indicesToTags([-1, 53])).toEqual([])
})
