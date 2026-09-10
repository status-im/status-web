import { afterEach, describe, expect, it, vi } from 'vitest'

afterEach(() => {
  vi.unstubAllEnvs()
  vi.resetModules()
})

describe('Swap availability by build mode', () => {
  it.each(['production', 'test', 'staging'])('hides Swap in %s', async mode => {
    vi.stubEnv('MODE', mode)
    const { FEATURE_FLAGS } = await import('./feature-flags')
    expect(FEATURE_FLAGS.SWAP).toBe(false)
  })

  it('shows Swap in standalone development builds even when DEV is false', async () => {
    vi.stubEnv('MODE', 'development')
    vi.stubEnv('DEV', false)
    const { FEATURE_FLAGS } = await import('./feature-flags')
    expect(FEATURE_FLAGS.SWAP).toBe(true)
  })
})
