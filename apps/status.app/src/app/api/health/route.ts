// Liveness probe for self-hosted runtime (Docker HEALTHCHECK, K8s livenessProbe).
// Intentionally cheap: no DB query, no external fetch.

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export function GET() {
  return Response.json({ ok: true, ts: Date.now() })
}
