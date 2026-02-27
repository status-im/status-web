export async function GET() {
  const url = process.env.GHOST_API_URL ?? 'https://our.status.im'
  const key = process.env.GHOST_API_KEY

  try {
    const start = Date.now()
    const res = await fetch(
      `${url}/ghost/api/content/posts/?key=${key}&limit=1`,
      {
        cache: 'no-store',
      },
    )
    const elapsed = Date.now() - start

    return Response.json({
      status: res.status,
      ok: res.ok,
      elapsed: `${elapsed}ms`,
      url: url,
      hasKey: !!key,
    })
  } catch (error) {
    return Response.json(
      {
        error: String(error),
        cause:
          error instanceof TypeError && 'cause' in error
            ? String(error.cause)
            : undefined,
        url: url,
        hasKey: !!key,
      },
      { status: 500 },
    )
  }
}
