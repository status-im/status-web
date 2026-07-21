import { describe, expect, it } from 'vitest'

import {
  getRetryAfterSeconds,
  hasErrorCause,
  parseRetryAfterSeconds,
  RateLimitError,
} from './error-cause'

describe('hasErrorCause', () => {
  it('finds a direct cause', () => {
    expect(hasErrorCause(new Error('limited', { cause: 429 }), 429)).toBe(true)
  })

  it('finds a cause through wrapper errors', () => {
    const providerError = new Error('limited', { cause: 429 })
    const serviceError = new Error('service failed', { cause: providerError })
    const procedureError = new Error('procedure failed', {
      cause: serviceError,
    })

    expect(hasErrorCause(procedureError, 429)).toBe(true)
  })

  it('handles cyclic cause chains', () => {
    const error = new Error('cyclic')
    Object.defineProperty(error, 'cause', { value: error })

    expect(hasErrorCause(error, 429)).toBe(false)
  })
})

describe('rate-limit metadata', () => {
  it('finds retry metadata through wrapper errors', () => {
    const providerError = new RateLimitError('limited', 17)
    const wrapper = new Error('request failed', { cause: providerError })

    expect(getRetryAfterSeconds(wrapper)).toBe(17)
  })

  it('parses delta seconds and HTTP dates', () => {
    const now = Date.parse('2026-01-01T00:00:00Z')

    expect(parseRetryAfterSeconds('12', now)).toBe(12)
    expect(parseRetryAfterSeconds('Thu, 01 Jan 2026 00:00:09 GMT', now)).toBe(9)
  })

  it('rejects invalid retry-after values', () => {
    expect(parseRetryAfterSeconds(null)).toBeUndefined()
    expect(parseRetryAfterSeconds('-1')).toBeUndefined()
    expect(parseRetryAfterSeconds('not-a-date')).toBeUndefined()
  })
})
