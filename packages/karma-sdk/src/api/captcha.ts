export function getPowCaptchaEndpoint(baseUrl: string): string {
  return `${baseUrl.replace(/\/$/, '')}/captcha/cap/`
}

export function isValidCaptchaToken(token: unknown): token is string {
  return typeof token === 'string' && token.trim().length > 0
}
