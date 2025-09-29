import { Breadcrumbs } from '~components/breadcrumbs'

import { getDevice } from './_actions'
import { ViewDevice } from './_components/view-device'

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

export default async function DevicePage({ params }: Params) {
  const { id: deviceId } = await params

  const { data } = await getDevice(deviceId)

  const breadcrumbs = [
    {
      label: 'Devices',
      href: '/admin/keycard/devices',
    },
    {
      label: deviceId,
      href: `/admin/keycard/devices/${deviceId}`,
    },
  ]

  return (
    <>
      <div className="absolute left-0 top-0 block w-full xl:hidden">
        <Breadcrumbs items={breadcrumbs} variant="admin" />
      </div>
      <div className="flex flex-col pt-8 xl:pt-0">
        <h1 className="text-19 font-semibold">{deviceId}</h1>
        <ViewDevice data={data} uid={deviceId} />
      </div>
    </>
  )
}
