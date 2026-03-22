/**
 * HTTP status codes that should trigger token invalidation and retry.
 * - 401: Unauthorized - token is invalid or expired
 * - 403: Forbidden - token doesn't have required permissions
 * - 429: Too Many Requests - rate limited
 */
export const RETRY_STATUS_CODES = new Set([401, 403, 429])

export const STORAGE_KEY = 'hub-puzzle-auth'
