import { NextResponse } from 'next/server'

import { getEthereumClient } from './_lib/ethereum-client'

export const revalidate = 600 // 10 minutes

export type EnsResponse = {
  publicKey: string
}

export async function POST(request: Request) {
  const { ensName, compress } = await request.json()

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
