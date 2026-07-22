import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { getRetryAfterSeconds } from '../../../utils/error-cause'
import { clearRateLimitCache } from './rate-limiter'
import { portfolioRefreshProcedure, router } from './trpc'

const refreshRouter = router({
  assets: portfolioRefreshProcedure.query(() => 'assets'),
  activity: portfolioRefreshProcedure.query(() => 'activity'),
})

const createCaller = (ip: string) =>
  refreshRouter.createCaller({
    headers: new Headers({ 'x-forwarded-for': ip }),
  })

describe('portfolio refresh rate limit', () => {
  beforeEach(() => {
    clearRateLimitCache()
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-01-01T00:00:00Z'))
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('shares a 20-request burst budget across aggregate procedures', async () => {
    const caller = createCaller('192.0.2.1')

    for (let index = 0; index < 10; index++) {
      await expect(caller.assets()).resolves.toBe('assets')
      await expect(caller.activity()).resolves.toBe('activity')
    }

    const rejectedRequest = caller.assets()
    await expect(rejectedRequest).rejects.toMatchObject({
      code: 'TOO_MANY_REQUESTS',
      message:
        'Too many portfolio refreshes. Please wait a moment and try again.',
    })
    await expect(rejectedRequest).rejects.toSatisfy(
      error => getRetryAfterSeconds(error) === 1,
    )
  })

  it('allows another request after one token refills', async () => {
    const caller = createCaller('192.0.2.1')

    for (let index = 0; index < 20; index++) {
      await caller.assets()
    }

    vi.advanceTimersByTime(500)
    await expect(caller.assets()).resolves.toBe('assets')
  })
})
