'use client'

import { Button } from '@status-im/components'
import { useRouter } from 'next/navigation'

import { AlertDialog } from '~admin/_components/alert-dialog'
import { DataItem } from '~admin/_components/data-item'
import { useUserContext } from '~admin/_contexts/user-context'
import { shortDate } from '~admin/_utils'

import { removeDevice } from '../_actions'

type Props = {
  uid: string
  data?: {
    publicKey?: string
    importedAt?: string
    firstVerifiedAt?: string
    verifications?: number
    firmware?: string
    database?: string
    history?: {
      date: string
      message: string
    }[]
  }
}

const DEFAULT_DATA = {
  publicKey: '-',
  importedAt: '-',
  firstVerifiedAt: '-',
  verifications: '-',
  firmware: '-',
  database: '-',
  history: [],
}

const ViewDevice = (props: Props) => {
  const { uid, data = DEFAULT_DATA } = props
  const router = useRouter()

  const user = useUserContext()

  const handleRemove = async () => {
    return await removeDevice(uid).finally(() => {
      router.push('/admin/keycard/devices')
    })
  }

  return (
    <div className="max-w-[462px]">
      <div className="flex w-full flex-col gap-3 py-4">
        <DataItem label="Public key" mono>
          {data.publicKey}
        </DataItem>
        <div className="flex gap-3">
          <DataItem label="Imported" className="w-1/3">
            {shortDate(new Date(data.importedAt || ''))}
          </DataItem>
          <DataItem label="First Verified" className="w-1/3">
            {shortDate(new Date(data.firstVerifiedAt || ''))}
          </DataItem>
          <DataItem label="Verifications" className="w-1/3">
            {data.verifications}
          </DataItem>
        </div>
      </div>
      {/* Divider */}
      <hr className="my-2 h-0.5 border-neutral-10" />
      <div className="flex flex-col gap-3 py-4">
        <p className="text-15 font-semibold">Manufacturing details</p>
        <div className="flex gap-3">
          <DataItem
            label="Firmware"
            href={`/admin/keycard/firmwares/${data.firmware}`}
          >
            {data.firmware}
          </DataItem>

          <DataItem
            label="Database"
            href={`/admin/keycard/databases/${data.database}`}
          >
            {data.database}
          </DataItem>
        </div>
      </div>
      {/* Divider */}
      <hr className="my-2 h-0.5 border-neutral-10" />
      <div className="flex flex-col gap-3 py-4">
        <p className="text-15 font-semibold">History</p>
        <div className="flex flex-col gap-2">
          {data.history?.map((item, index) => (
            <div key={index} className="flex gap-4">
              <p className="w-[58px] text-13 font-medium text-neutral-50">
                {shortDate(new Date(item.date))}
              </p>
              <p className="text-13 font-medium">{item.message}</p>
            </div>
          ))}
        </div>
      </div>
      {user.canEditKeycard && (
        <>
          {/* Divider */}
          <hr className="my-2 h-0.5 border-neutral-10" />
          <div className="flex flex-col py-4">
            <p className="text-15 font-semibold">Danger zone</p>
            <p className="text-13 text-neutral-50">
              Please be sure. This action cannot be reverted
            </p>
            <div className="pt-3">
              <AlertDialog title="Remove device" onConfirm={handleRemove}>
                <Button size="32" variant="danger">
                  Remove device
                </Button>
              </AlertDialog>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export { ViewDevice }
