'use client'

import { Button } from '@status-im/components'
import { useTranslations } from 'next-intl'

import { getAdminSegmentPluralLabel } from '~admin/insights/_utils/i18n'

import type { Segments } from '~admin/_contexts/layout-context'

type Props = {
  segment: Segments | 'milestones'
  onClear: () => void
}

const EmptySearchResults = (props: Props) => {
  const { segment, onClear } = props
  const t = useTranslations('admin')

  const segmentLabel = getAdminSegmentPluralLabel(t, segment)

  return (
    <div className="flex flex-col items-center justify-center gap-1 py-[88px]">
      <div className="px-5 py-3 text-center">
        <p className="text-15 font-semibold">
          {t('noResultsTitle', { segment: segmentLabel })}
        </p>
        <p className="text-13">
          {t('noResultsDescription', { segment: segmentLabel })}
        </p>
      </div>
      <Button variant="outline" size="24" onPress={onClear}>
        {t('clearFilters')}
      </Button>
    </div>
  )
}

export { EmptySearchResults }
