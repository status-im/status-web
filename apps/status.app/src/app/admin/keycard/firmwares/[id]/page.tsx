import Link from 'next/link'
import { getTranslations } from 'next-intl/server'

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
  const t = await getTranslations('admin')

  return (
    <div className="flex flex-col">
      <h1 className="text-27">{t('firmwareVersionTitle', { id })}</h1>
      <div className="flex flex-col gap-6">
        <Link href="/admin/keycard/firmwares">{t('backToFirmwares')}</Link>
      </div>
    </div>
  )
}
