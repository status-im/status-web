import { describe, expect, it } from 'vitest'

import { hasErrorCause } from './error-cause'

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
