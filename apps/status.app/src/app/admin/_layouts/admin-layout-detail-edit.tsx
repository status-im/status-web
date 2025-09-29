import { Button } from '@status-im/components'

import { Breadcrumbs } from '~components/breadcrumbs'

import { AlertDialog } from '../_components/alert-dialog'

import type { BreadcrumbsProps } from '~components/breadcrumbs'

type Props = {
  title: string
  children: React.ReactNode
  breadcrumbs: BreadcrumbsProps['items']
}

const AdminLayoutDetailEdit = (props: Props) => {
  const { title, children, breadcrumbs } = props

  return (
    <>
      {breadcrumbs && (
        <div className="absolute inset-x-0 top-0 z-20 bg-blur-white/70 xl:hidden">
          <Breadcrumbs items={breadcrumbs} variant="admin" />
        </div>
      )}
      <div className="max-w-[462px] max-xl:pt-8">
        <h1 className="mb-6 text-19 font-semibold">{title}</h1>
        <div className="grid gap-6">{children}</div>
      </div>
    </>
  )
}

const Separator = () => {
  return <hr className="h-0.5 border-neutral-10" />
}

type DangerZoneProps = {
  actionLabel: string
  onConfirm: () => Promise<unknown>
}

export const DangerZone = (props: DangerZoneProps) => {
  const { actionLabel, onConfirm } = props

  return (
    <div className="pb-16">
      <Separator />

      <div className="flex flex-col py-6">
        <p className="text-15 font-semibold">Danger zone</p>
        <p className="text-13 text-neutral-50">
          Please be sure. This action cannot be reverted
        </p>
        <div className="pt-3">
          <AlertDialog title={actionLabel} onConfirm={onConfirm}>
            <Button size="32" variant="danger">
              {actionLabel}
            </Button>
          </AlertDialog>
        </div>
      </div>
    </div>
  )
}

AdminLayoutDetailEdit.Separator = Separator
AdminLayoutDetailEdit.DangerZone = DangerZone

export { AdminLayoutDetailEdit }
export type { Props as AdminLayoutDetailEditProps }
