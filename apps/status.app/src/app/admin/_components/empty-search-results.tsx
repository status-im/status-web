'use client'

import { Button } from '@status-im/components'

import type { Segments } from '~admin/_contexts/layout-context'

type Props = {
  segment: Segments | 'milestones'
  onClear: () => void
}

const EmptySearchResults = (props: Props) => {
  const { segment, onClear } = props

  return (
    <div className="flex flex-col items-center justify-center gap-1 py-[88px]">
      <div className="px-5 py-3 text-center">
        <p className="text-15 font-semibold">No {segment} found.</p>
        <p className="text-13">
          We didn&apos;t found any {segment} that match your filters
        </p>
      </div>
      <Button variant="outline" size="24" onPress={onClear}>
        Clear filters
      </Button>
    </div>
  )
}

export { EmptySearchResults }
