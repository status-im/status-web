import { Text } from '@status-im/components'
import { useTranslations } from 'next-intl'

export function BlogEmptyState({
  postsUnavailable,
}: {
  postsUnavailable: boolean
}) {
  const t = useTranslations('blog')

  return (
    <div className="flex min-h-[320px] flex-col items-center justify-center text-center">
      <Text size={19} weight="semibold">
        {t(postsUnavailable ? 'maintenanceTitle' : 'emptyTitle')}
      </Text>
      <div className="pb-1" />
      <Text size={15} color="$neutral-50">
        {t(postsUnavailable ? 'maintenanceDescription' : 'emptyDescription')}
      </Text>
    </div>
  )
}
