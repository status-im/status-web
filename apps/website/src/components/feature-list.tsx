import { Text } from '@status-im/components'
import Image from 'next/image'

import type { illustrations } from '@/config/illustrations'

type Item = {
  title: string
  description: string
  image: (typeof illustrations)[keyof typeof illustrations]
}

type Props = {
  list: Item[]
}

export const FeatureList = (props: Props) => {
  const { list } = props
  return (
    <div className="container grid grid-cols-1 gap-12 pb-24 pt-12 sm:grid-cols-2 lg:grid-cols-3 lg:gap-20">
      {list.map(feature => (
        <div key={feature.title} className="flex flex-col">
          <Image
            {...feature.image}
            alt={feature.image.alt}
            className="mb-4 ml-0"
          />
          <Text size={27} weight="semibold">
            {feature.title}
          </Text>
          <Text size={19}>{feature.description}</Text>
        </div>
      ))}
    </div>
  )
}
