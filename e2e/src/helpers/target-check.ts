/**
 * Fail the run before any test starts when the site under test does not
 * answer. A host that accepts the connection but never responds makes every
 * `page.goto` wait out its navigation timeout, and with retries on one worker
 * the run hangs until the job timeout cancels it.
 *
 * Any HTTP response counts, a 5xx included: tests fail fast on those and say
 * what is wrong. Callers pass the bypass header for the site under test, so
 * the check gets past bot protection the way the tests do.
 *
 * Keep this file in step with the copy in logos-web
 * (`e2e/src/helpers/target-check.ts`).
 */

const ATTEMPTS = 3
const ATTEMPT_TIMEOUT_MS = 10_000
const RETRY_DELAY_MS = 2_000

/** Headers for one target, such as the bypass header of the site under test. */
export type HeadersFor = (url: string) => Record<string, string>

/** Why `url` did not answer, or `undefined` once it sends any response. */
async function noAnswer(
  url: string,
  headers: Record<string, string>,
): Promise<string | undefined> {
  try {
    const response = await fetch(url, {
      headers,
      redirect: 'manual',
      signal: AbortSignal.timeout(ATTEMPT_TIMEOUT_MS),
    })
    await response.body?.cancel()
    return undefined
  } catch (error) {
    if (!(error instanceof Error)) return String(error)
    if (error.name === 'TimeoutError') {
      return `no response within ${ATTEMPT_TIMEOUT_MS / 1000}s`
    }
    const cause = error.cause as { code?: string; message?: string } | undefined
    return cause?.code ?? cause?.message ?? error.message
  }
}

async function assertAnswers(
  url: string,
  headers: Record<string, string>,
): Promise<void> {
  let reason: string | undefined
  for (let attempt = 1; attempt <= ATTEMPTS; attempt++) {
    reason = await noAnswer(url, headers)
    if (!reason) return
    console.warn(
      `[target-check] ${url}: ${reason} (attempt ${attempt}/${ATTEMPTS})`,
    )
    if (attempt < ATTEMPTS) {
      await new Promise(resolve => setTimeout(resolve, RETRY_DELAY_MS))
    }
  }
  throw new Error(
    `${url} did not answer after ${ATTEMPTS} attempts (${reason}). ` +
      'The site is down or unreachable, so no test ran.',
  )
}

/** Throws when one of `urls` sends no HTTP response at all. */
export async function assertTargetsAnswer(
  urls: string[],
  headersFor: HeadersFor = () => ({}),
): Promise<void> {
  const unique = [...new Set(urls)]
  const results = await Promise.allSettled(
    unique.map(url => assertAnswers(url, headersFor(url))),
  )
  const errors = results.flatMap(result =>
    result.status === 'rejected'
      ? [String(result.reason?.message ?? result.reason)]
      : [],
  )
  if (errors.length > 0) throw new Error(errors.join('\n'))
}
