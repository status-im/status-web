import { expect, test } from 'vitest'

import { getObjectsDifference } from './get-objects-difference'

test('should return correct difference', () => {
  const oldObject = { a: 1, b: 2, c: 3 }
  const newObject = { c: 3, d: 4, e: 5 }

  expect(getObjectsDifference(oldObject, newObject)).toEqual({
    added: {
      d: 4,
      e: 5,
    },
    removed: ['a', 'b'],
  })
})

test('should return empty arrays for the same object', () => {
  const object = { a: 1, b: 2, c: 3 }

  expect(getObjectsDifference(object, object)).toEqual({
    added: {},
    removed: [],
  })
})
