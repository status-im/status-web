import { Text } from '@status-im/components'
import { cx } from 'class-variance-authority'
import Image from 'next/image'

import type { illustrations } from '@/config/illustrations'

type Item = {
  title: string
  description: string
  image: (typeof illustrations)[keyof typeof illustrations]
}

type Props = {
  list: Item[]
  dark?: boolean
}

export const FeatureList = (props: Props) => {
  const { list, dark = false } = props
  return (
    <div className="container pb-24 pt-12 lg:m-auto lg:gap-10">
      <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:-ml-10 lg:grid-cols-3">
        {list.map(({ title, image, description }, i) => (
          <div key={title} className="flex flex-col">
            <Image {...image} alt={image.alt} className="mb-4 ml-10" />
            <div
              className={cx(
                'flex flex-col border-dashed border-l-neutral-30 lg:border-l-[1px] lg:pl-10',
                (i === 0 || i === 3) && 'lg:border-l-0',
                dark && 'border-l-neutral-70'
              )}
            >
              <Text size={27} weight="semibold">
                {title}
              </Text>
              <Text size={19}>{description}</Text>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
