import { describe, expect, test } from 'vitest'

import { isHelpDocWorkInProgress } from './help-doc'

describe('isHelpDocWorkInProgress', () => {
  test('returns true for a doc with an empty body', () => {
    expect(isHelpDocWorkInProgress({ body: { raw: '' } })).toBe(true)
  })

  test('returns false for a doc with content', () => {
    expect(
      isHelpDocWorkInProgress({ body: { raw: 'Some help content.' } })
    ).toBe(false)
  })
})
