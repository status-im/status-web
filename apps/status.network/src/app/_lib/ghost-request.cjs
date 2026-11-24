const GHOST_REQUEST_TIMEOUT_MS = 10_000
const GHOST_RETRY_DELAY_MS = 500

/**
 * @param {URL} url
 * @param {RequestInit & { retries?: number, next?: { revalidate: number } }} options
 */
async function fetchGhostJson(url, { retries = 0, ...init } = {}) {
  for (let attempt = 0; ; attempt++) {
    try {
      const response = await fetch(url, {
        ...init,
        signal: AbortSignal.timeout(GHOST_REQUEST_TIMEOUT_MS),
      })

      if (response.ok) return await response.json()

      const retryable = response.status === 429 || response.status >= 500
      await response.body?.cancel()

      if (!retryable || attempt === retries) {
        throw new Error(`Ghost API request failed with ${response.status}`)
      }
    } catch (error) {
      const retryable =
        error instanceof TypeError || error?.name === 'TimeoutError'

      if (!retryable || attempt === retries) throw error
    }

    // Allow a transient upstream failure to recover before trying again.
    await new Promise(resolve =>
      setTimeout(resolve, GHOST_RETRY_DELAY_MS * 2 ** attempt),
    )
  }
}

module.exports = { fetchGhostJson }
