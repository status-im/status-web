export function buildTrpcUrl(
  endpoint: string,
  params: Record<string, unknown>,
): URL {
  const url = new URL(
    `${import.meta.env.WXT_STATUS_API_URL}/api/trpc/${endpoint}`,
  )
  url.searchParams.set(
    'input',
    JSON.stringify({
      json: params,
    }),
  )
  return url
}

export function extractTrpcErrorMessage(body: unknown): string | null {
  if (typeof body !== 'object' || body === null) {
    return null
  }

  const bodyObj = body as {
    error?: {
      message?: string
      json?: { message?: string }
      data?: { message?: string }
    }
  }

  return (
    bodyObj.error?.json?.message ||
    bodyObj.error?.data?.message ||
    bodyObj.error?.message ||
    null
  )
}

export async function fetchTrpcData<T>(
  endpoint: string,
  params: Record<string, unknown>,
  errorMessage: string,
): Promise<T> {
  const url = buildTrpcUrl(endpoint, params)
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })

  const body = await response.json().catch(() => null)

  if (!response.ok) {
    const message = extractTrpcErrorMessage(body)
    throw new Error(message || errorMessage)
  }

  const trpcErrorMessage = extractTrpcErrorMessage(body)
  if (trpcErrorMessage) {
    throw new Error(trpcErrorMessage)
  }

  if (!body?.result?.data?.json) {
    throw new Error(errorMessage)
  }

  return body.result.data.json
}
