import Link from 'next/link'

import type { Metadata } from 'next'

type Params = {
  params: Promise<{
    id: string
  }>
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  return {
    title: (await params).id,
  }
}

export default async function FirmwarePage({ params }: Params) {
  const id = (await params).id
  return (
    <div className="flex flex-col">
      <h1 className="text-27">Firmware - version {id}</h1>
      <div className="flex flex-col gap-6">
        <Link href="/admin/keycard/firmwares">Back to firmwares</Link>
      </div>
    </div>
  )
}
