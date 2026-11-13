import { NextResponse } from 'next/server'

import { submitApplication } from '~website/_lib/greenhouse'

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  if (!/^\d+$/.test(id)) {
    return NextResponse.json({ error: 'Invalid job ID.' }, { status: 400 })
  }

  const body = await request.json()

  try {
    const data = await submitApplication(id, JSON.stringify(body))
    return NextResponse.json({ data }, { status: data.status ?? 200 })
  } catch (err) {
    console.error(err)
    return NextResponse.json(
      { error: 'An error occurred while submitting the application.' },
      { status: 500 }
    )
  }
}
