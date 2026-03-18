import { getTranslations } from 'next-intl/server'

import { Breadcrumbs } from '~components/breadcrumbs'

import { NewDeviceForm } from './_components/new-device'

export default async function NewDevicePage() {
  const t = await getTranslations('admin')
  const breadcrumbs = [
    {
      label: t('devices'),
      href: '/admin/keycard/devices',
    },
    {
      label: t('newDevice'),
      href: `/admin/keycard/devices/new`,
    },
  ]

  return (
    <div className="w-full">
      <div className="absolute left-0 top-0 z-20 block w-full bg-blur-white/70 backdrop-blur-[20px] xl:hidden">
        <Breadcrumbs items={breadcrumbs} variant="admin" />
      </div>
      <div className="flex h-full flex-col pt-8 xl:pt-0">
        <h1 className="text-19 font-semibold">{t('newDevice')}</h1>
        <div className="size-full py-6">
          <NewDeviceForm />
        </div>
      </div>
    </div>
  )
}
