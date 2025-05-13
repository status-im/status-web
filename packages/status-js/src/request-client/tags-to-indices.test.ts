import { expect, test } from 'vitest'

import { tagsToIndices } from './tags-to-indices'

test('should return tags for indices', () => {
  expect(tagsToIndices(['Art', 'Blockchain', 'Books & blogs'])).toEqual([
    1, 2, 3,
  ])
})

test('should not return tags for no indices', () => {
  expect(tagsToIndices([])).toEqual([])
})

test('should not return tags for unknown indices', () => {
  expect(tagsToIndices(['foo', 'bar'])).toEqual([])
})
