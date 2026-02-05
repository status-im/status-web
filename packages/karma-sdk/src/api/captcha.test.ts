import { describe, expect, it } from 'vitest'

import { getPowCaptchaEndpoint, isValidCaptchaToken } from './captcha'

describe('captcha helpers', () => {
  it('builds endpoint with or without trailing slash', () => {
    expect(getPowCaptchaEndpoint('https://api.example.com')).toBe(
      'https://api.example.com/captcha/cap/'
    )
    expect(getPowCaptchaEndpoint('https://api.example.com/')).toBe(
      'https://api.example.com/captcha/cap/'
    )
  })

  it('validates token values', () => {
    expect(isValidCaptchaToken('token')).toBe(true)
    expect(isValidCaptchaToken('')).toBe(false)
    expect(isValidCaptchaToken('   ')).toBe(false)
  })
})
