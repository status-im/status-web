/**
 * Checks an Error.cause chain without assuming how many layers wrapped the
 * original failure.
 */
export function hasErrorCause(error: unknown, expectedCause: unknown): boolean {
  const visited = new Set<Error>()
  let current = error

  while (current instanceof Error && !visited.has(current)) {
    visited.add(current)

    if (current.cause === expectedCause) return true
    current = current.cause
  }

  return false
}

export class RateLimitError extends Error {
  constructor(
    message: string,
    readonly retryAfterSeconds?: number,
    cause: unknown = 429,
  ) {
    super(message, { cause })
  }
}

export function getRetryAfterSeconds(error: unknown): number | undefined {
  const visited = new Set<Error>()
  let current = error

  while (current instanceof Error && !visited.has(current)) {
    visited.add(current)

    if (
      'retryAfterSeconds' in current &&
      typeof current.retryAfterSeconds === 'number'
    ) {
      return current.retryAfterSeconds
    }
    current = current.cause
  }

  return undefined
}

export function parseRetryAfterSeconds(
  value: string | null,
  now = Date.now(),
): number | undefined {
  if (!value) return undefined

  const seconds = Number(value)
  if (Number.isFinite(seconds) && seconds >= 0) return Math.ceil(seconds)
  if (Number.isFinite(seconds)) return undefined

  const date = Date.parse(value)
  if (Number.isNaN(date)) return undefined

  return Math.max(0, Math.ceil((date - now) / 1000))
}
