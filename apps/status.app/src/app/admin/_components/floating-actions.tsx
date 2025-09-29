'use client'

import { Button } from '@status-im/components'
import { LoadingIcon } from '@status-im/icons/20'
import Link from 'next/link'
import { match } from 'ts-pattern'

type Props = {
  variant: 'create' | 'edit'
  segment:
    | 'workstream'
    | 'release'
    | 'device'
    | 'database'
    | 'firmware'
    | 'user'
    | 'epic'
    | 'project'
    | 'report'
  isDisabled?: boolean
  loading?: boolean
}

const parentRoutePerSegment = {
  workstream: '/admin/insights/workstreams',
  release: '/admin/insights/releases',
  device: '/admin/keycard/devices',
  database: '/admin/keycard/databases',
  firmware: '/admin/keycard/firmwares',
  user: '/admin/users',
  epic: '/admin/insights/epics',
  project: '/admin/insights/projects',
  report: '/admin/reporting',
}

const FloatingActions = (props: Props) => {
  const { segment, isDisabled, variant, loading } = props

  const { label, submitButtonLabel } = match(variant)
    .with('create', () => {
      return {
        label: `Adding a new ${segment}`,
        submitButtonLabel: 'Add',
      }
    })
    .with('edit', () => {
      return {
        label: `You have unsaved changes`,
        submitButtonLabel: 'Save',
      }
    })
    .exhaustive()

  return (
    <div className="fixed bottom-4 left-[calc(50%-210px)] z-50 w-[494px] animate-slideInFromBottom rounded-16 border border-neutral-10 bg-white-100 shadow-2 transition duration-200 xl:left-12">
      <div className="flex items-center justify-between">
        <div className="px-4 py-3 text-15 font-medium">{label}</div>

        <div className="flex gap-2 p-2">
          <Link
            href={parentRoutePerSegment[segment]}
            aria-disabled={loading}
            className={loading ? 'pointer-events-none' : 'pointer-events-auto'}
          >
            <Button variant="outline" size="32" disabled={loading}>
              Dismiss
            </Button>
          </Link>
          <button
            className="relative flex h-8 w-full items-center justify-center gap-1 rounded-12 bg-default-customisation-blue-50 px-3 py-2 text-15 font-semibold text-white-100 transition hover:bg-default-customisation-blue-60 disabled:opacity-[30%]"
            type="submit"
            aria-disabled={loading || isDisabled}
            disabled={loading || isDisabled}
          >
            {loading ? (
              <LoadingIcon className="animate-spin text-white-100" />
            ) : (
              submitButtonLabel
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

export { FloatingActions }
