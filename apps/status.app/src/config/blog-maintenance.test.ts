import { afterEach, describe, expect, it, vi } from 'vitest'

import { isBlogInMaintenance } from './blog-maintenance'

afterEach(() => vi.unstubAllEnvs())

describe('blog maintenance', () => {
  it('enables the blog by default', () => {
    vi.stubEnv('BLOG_MAINTENANCE_MODE', undefined)
    expect(isBlogInMaintenance()).toBe(false)
  })

  it('only enables maintenance when explicitly requested', () => {
    vi.stubEnv('BLOG_MAINTENANCE_MODE', '1')
    expect(isBlogInMaintenance()).toBe(true)
    vi.stubEnv('BLOG_MAINTENANCE_MODE', '0')
    expect(isBlogInMaintenance()).toBe(false)
  })
})
