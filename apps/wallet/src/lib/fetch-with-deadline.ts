// Chrome stops an extension worker whose fetch waits over 30 s, so this must fire first.
export const REQUEST_DEADLINE_MS = 20 * 1000

/** Rejects with `timeoutMessage` after `ms`, body read included, so a stalled request cannot hold a nonce lock. */
export async function fetchWithDeadline<T>(
  url: string,
  init: RequestInit,
  ms: number,
  read: (response: Response) => Promise<T>,
  timeoutMessage: string,
): Promise<T> {
  const controller = new AbortController()
  let timer: ReturnType<typeof setTimeout> | undefined
  const deadline = new Promise<never>((_, reject) => {
    timer = setTimeout(() => {
      controller.abort()
      reject(new Error(timeoutMessage))
    }, ms)
  })
  const request = fetch(url, { ...init, signal: controller.signal }).then(read)
  // After a timeout the request's own AbortError arrives with nobody awaiting it.
  request.catch(() => {})
  try {
    return await Promise.race([request, deadline])
  } finally {
    clearTimeout(timer)
  }
}
