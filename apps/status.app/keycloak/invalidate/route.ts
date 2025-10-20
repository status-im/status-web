import { invalidateSession } from '~server/services/auth'

export async function GET(): Promise<Response> {
  const isSessionInvalid = await invalidateSession()

  if (!isSessionInvalid) {
    return new Response(null, { status: 500 })
  }

  return new Response(null, { status: 200 })
}
