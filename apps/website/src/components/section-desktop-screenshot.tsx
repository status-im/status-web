import React from 'react'

import { Text } from '@status-im/components'
import Image, { type StaticImageData } from 'next/image'

import { type Illustration, illustrations } from '@/config/illustrations'

type Props = {
  icon: Illustration
  title: string
  description: string
  image: StaticImageData
  dark?: boolean
}

export const SectionDesktopScreenshot = (props: Props) => {
  const { icon, title, description, image, dark } = props

  const illustration = illustrations[icon]

  return (
    <>
      <div className="m-auto max-w-[1083px] p-5 pb-6 pt-20 lg:pb-5">
        <div className="max-w-[462px]">
          <Image
            src={illustration.src}
            alt={illustration.alt}
            width={48}
            height={48}
          />

          <div className="flex flex-col pt-4">
            <Text size={27} weight="semibold" color={dark ? '$white-100' : ''}>
              {title}
            </Text>
            <div className="relative flex pt-1">
              <Text size={27} color={dark ? '$white-100' : ''}>
                {description}
              </Text>
            </div>
          </div>
        </div>
      </div>
      <Image src={image} alt={title} className="p-5 pb-16 lg:p-10 lg:pb-20" />
    </>
  )
}
