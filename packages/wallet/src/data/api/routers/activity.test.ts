import { describe, expect, it, vi } from 'vitest'

import { MAX_PAGE_LIMIT, pageInputSchema } from './activity'

vi.mock('../../services/alchemy', () => ({}))
vi.mock('../../services/coingecko/index', () => ({}))

const input = { address: '0x0', networks: ['ethereum'] }

describe('pageInputSchema', () => {
  it('accepts limits up to the cap', () => {
    expect(
      pageInputSchema.safeParse({ ...input, limit: MAX_PAGE_LIMIT }).success,
    ).toBe(true)
  })

  it('rejects limits above the cap', () => {
    expect(
      pageInputSchema.safeParse({ ...input, limit: MAX_PAGE_LIMIT + 1 })
        .success,
    ).toBe(false)
  })

  it('rejects non-positive limits', () => {
    expect(pageInputSchema.safeParse({ ...input, limit: 0 }).success).toBe(
      false,
    )
  })

  it('removes duplicate networks', () => {
    expect(
      pageInputSchema.parse({
        ...input,
        networks: ['ethereum', 'ethereum'],
      }).networks,
    ).toEqual(['ethereum'])
  })
})
