/**
 * Extract the `exp` claim from a JWT and return it in milliseconds.
 * Returns `null` if the token is malformed or has no `exp`.
 */
export function parseJwtExp(token: string): number | null {
  try {
    const payload = token.split('.')[1]
    if (!payload) return null
    const decoded = JSON.parse(atob(payload))
    if (typeof decoded.exp !== 'number') return null
    return decoded.exp * 1000
  } catch {
    return null
  }
}
