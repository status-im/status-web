import Link from 'next/link'
import { getTranslations } from 'next-intl/server'

export default async function NewFirmwarePage() {
  const t = await getTranslations('admin')

  return (
    <div className="flex flex-col">
      <h1 className="text-27">{t('newFirmware')}</h1>
      <div className="flex flex-col gap-6">
        <Link href="/admin/keycard/firmwares">{t('backToFirmwares')}</Link>
      </div>
    </div>
  )
}
