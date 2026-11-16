import { NextResponse } from 'next/server'
import { z } from 'zod'

import { getEthereumClient } from './_lib/ethereum-client'

export const revalidate = 600 // 10 minutes

// Status usernames are `name.stateofus.eth` or `name.eth`. The resolver walks
// up one label at a time, so cap labels to bound upstream RPC calls per request.
const MAX_ENS_NAME_LENGTH = 255
const MAX_ENS_LABELS = 5

const bodySchema = z.object({
  ensName: z
    .string()
    .min(1)
    .max(MAX_ENS_NAME_LENGTH)
    .refine(name => name.split('.').length <= MAX_ENS_LABELS),
  compress: z.boolean().default(false),
})

export type EnsResponse = {
  publicKey: string
}

export async function POST(request: Request) {
  const result = bodySchema.safeParse(await request.json().catch(() => null))

  if (!result.success) {
    return NextResponse.json({ error: 'Invalid ENS name' }, { status: 400 })
  }

  const { ensName, compress } = result.data

  const client = getEthereumClient()

  if (!client) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }

  const publicKey = await client.resolvePublicKey(ensName, {
    compress,
  })

  if (!publicKey) {
    return NextResponse.json({ error: 'ENS name not found' }, { status: 404 })
  }

  return NextResponse.json({ publicKey })
}
