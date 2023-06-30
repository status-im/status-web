import { cx } from 'class-variance-authority'
import Image from 'next/image'

import type { StaticImageData } from 'next/image'

type Props = {
  children: React.ReactNode
}

const ImageGrid = (props: Props) => {
  const { children } = props

  return (
    <div className="mx-auto grid max-w-[1255px] grid-flow-col grid-rows-6 gap-16">
      {children}
    </div>
  )
}

type ItemProps = {
  src: StaticImageData
  span: 1 | 2 | 3 | 4 | 5 | 6
  alt: string
}

const Item = (props: ItemProps) => {
  const { src, span, alt } = props

  return (
    <div
      className={cx([
        'relative',
        span === 1 && 'row-span-1',
        span === 2 && 'row-span-2',
        span === 3 && 'row-span-3',
        span === 4 && 'row-span-4',
        span === 5 && 'row-span-5',
        span === 6 && 'row-span-6',
      ])}
    >
      <Image src={src} alt={alt} />
    </div>
  )
}

ImageGrid.Item = Item

export { ImageGrid }
