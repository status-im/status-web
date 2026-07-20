import { describe, expect, it } from 'vitest'

import { isBlogCategory } from './_categories'

describe('isBlogCategory', () => {
  it('accepts configured blog categories', () => {
    expect(isBlogCategory('privacy-security')).toBe(true)
  })

  it.each(['toString', 'constructor', 'hasOwnProperty'])(
    'rejects inherited object key %s',
    category => {
      expect(isBlogCategory(category)).toBe(false)
    }
  )
})
