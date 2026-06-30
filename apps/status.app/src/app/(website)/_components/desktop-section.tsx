import { cx } from 'class-variance-authority'
import NextImage from 'next/image'

import { ScreenImage } from '~components/assets'

import { FeatureTag } from './feature-tag'

import type { ImageAlt, ImageId } from '~components/assets'
import type { FeatureType } from '~website/_features'

type Props = {
  title: React.ReactNode | string
  type: FeatureType
  description: string
  showFeatureTag?: boolean
  secondary?: React.ReactNode
  imageId?: ImageId
  imageAlt?: ImageAlt[ImageId] | string
  localImage?: {
    src: string
    alt: string
    width: number
    height: number
  }
}

const DesktopSection = (props: Props) => {
  const {
    title,
    description,
    showFeatureTag = true,
    secondary,
    imageId,
    imageAlt,
    localImage,
    type,
  } = props

  return (
    <div className="relative z-20 mx-auto grid max-w-[1424px] grid-cols-1 overflow-hidden rounded-20 bg-white-100 px-5 shadow-2 xl:grid-cols-2 xl:px-0">
      <div className="p-12 px-5 xl:px-10 xl:pl-12 2xl:pr-28">
        {showFeatureTag && (
          <div className="mb-4 flex">
            <FeatureTag type={type} />
          </div>
        )}
        <h3 className="mb-2 text-40 font-bold xl:text-64">{title}</h3>
        <p className="mb-20 max-w-[468px] text-19 font-regular xl:text-27">
          {description}
        </p>

        {secondary && (
          <div
            className={cx(
              'flex flex-col rounded-20 border border-dashed',
              'border-neutral-80/20 bg-white-20'
            )}
          >
            {secondary}
          </div>
        )}
      </div>
      {localImage ? (
        <NextImage
          className={cx(
            'overflow-hidden rounded-20 border-4 border-[var(--screen-border,#EAEEF1)] bg-[var(--screen-border,#EAEEF1)] md:rounded-[24px]',
            'max-xl:mb-[-20%] xl:absolute xl:left-[48%] xl:top-20'
          )}
          src={localImage.src}
          alt={localImage.alt}
          width={localImage.width}
          height={localImage.height}
          style={{ userSelect: 'none' }}
        />
      ) : (
        <ScreenImage
          className="max-xl:mb-[-20%] xl:absolute xl:left-[48%] xl:top-20"
          width={1240}
          height={775}
          id={imageId as ImageId}
          alt={imageAlt as ImageAlt[ImageId]}
        />
      )}
    </div>
  )
}

export { DesktopSection }
