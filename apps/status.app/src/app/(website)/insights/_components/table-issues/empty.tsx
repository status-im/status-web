import { Text } from '@status-im/components'
import Image from 'next/image'
import { useTranslations } from 'next-intl'
import emptyImage from 'public/assets/chart/empty.png'

const Empty = () => {
  const t = useTranslations('insights')
  return (
    <div className="flex size-full flex-col items-center justify-center">
      <div className="relative flex size-full items-center justify-center">
        <div className="relative z-10 flex flex-col items-center justify-center">
          <Image
            alt="No results found"
            src={emptyImage}
            width={80}
            height={80}
          />
          <div className="pb-3" />
          <Text size={15} weight="semibold">
            {t('noResultsFound')}
          </Text>
          <div className="pb-1" />
          <Text size={13} color="$neutral-50">
            {t('noResultsDescription')}
          </Text>
        </div>

        <div
          className="absolute left-0 top-0 h-24 w-full"
          style={{
            background: `linear-gradient(180deg, white, transparent)`,
          }}
        />
        <div className="absolute flex size-full justify-between opacity-[80%]">
          {Array.from({ length: 12 }).map((_, i) => (
            <div
              className="h-full w-1"
              style={{
                borderLeft: '1px dashed #F0F2F5',
              }}
              key={i}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

export { Empty }
