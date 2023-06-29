import { Text } from '@status-im/components'
import { cx } from 'class-variance-authority'
import Image from 'next/image'

import type { illustrations } from '@/config/illustrations'

type Item = {
  title: string
  description: string
  icon: (typeof illustrations)[keyof typeof illustrations]
}

type Props = {
  list: Item[]
  dark?: boolean
}

export const FeatureList = (props: Props) => {
  const { list, dark = false } = props
  return (
    <div className="container lg:m-auto lg:gap-10">
      <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:-ml-10 lg:grid-cols-3">
        {list.map(({ title, icon, description }, i) => (
          <div key={title} className="flex flex-col">
            <Image {...icon} alt={icon.alt} className="mb-4 ml-10" />
            <div
              className={cx(
                'flex flex-col border-dashed lg:pl-10',
                i % 3 === 0 ? 'lg:border-l-0' : 'lg:border-l-[1px]',
                dark ? 'border-l-neutral-70' : 'border-l-neutral-30'
              )}
            >
              <Text
                size={27}
                weight="semibold"
                color={dark ? '$white-100' : ''}
              >
                {title}
              </Text>
              <Text size={19} color={dark ? '$white-100' : ''}>
                {description}
              </Text>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
