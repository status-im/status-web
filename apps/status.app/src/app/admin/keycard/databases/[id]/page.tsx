import Link from 'next/link'

import type { Metadata } from 'next'

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  return {
    title: 'TODO' + (await params).id,
  }
}

type Props = {
  params: Promise<{
    id: string
  }>
}

export default async function DatabasePage({ params }: Props) {
  return (
    <div className="flex flex-col">
      <h1 className="text-27">Database - {(await params).id}</h1>
      <div className="flex flex-col gap-6">
        <Link href="/admin/keycard/databases">Back to databases</Link>
      </div>
    </div>
  )
}
