import { describe, expect, it } from 'vitest'

import { networksSchema } from './networks'

describe('networksSchema', () => {
  it('removes duplicate networks', () => {
    expect(networksSchema.parse(['ethereum', 'ethereum', 'ethereum'])).toEqual([
      'ethereum',
    ])
  })

  it('rejects unsupported networks', () => {
    expect(networksSchema.safeParse(['optimism']).success).toBe(false)
  })
})
