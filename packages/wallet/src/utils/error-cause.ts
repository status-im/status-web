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
