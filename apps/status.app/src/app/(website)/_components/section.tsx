import { Text } from '@status-im/components'
import { cva, cx } from 'class-variance-authority'

import { Icon, Image, ScreenImage, ScreenVideo } from '~components/assets'

import { Explanation } from './explanation'
import { ScreenBackground } from './screen-background'

import type { ExplanationType } from './explanation'
import type { ImageId, ImageType, VideoId } from '~components/assets'

type Props = {
  icon: ImageId
  title: string
  description: string
  explanation?: ExplanationType
  primarySlot?: React.ReactNode
  secondary: Array<{
    title: string
    description: string
  }>
  secondarySlot?: React.ReactNode
  screenBackground?: boolean
  desktopImage?: boolean
  reverse?: boolean
  dark?: boolean
} & (
  | {
      image: ImageType
      imagePosition?: 'bottom-right'
      video?: undefined
    }
  | {
      image?: undefined
      video: { id: VideoId; posterId: ImageId }
    }
)

const stylesScreenImages = cva(['w-full max-w-[334px]'], {
  variants: {
    desktopImage: {
      true: 'relative top-0 z-[-2] !aspect-auto min-w-[550px] max-w-[80%] rounded-b-0 border-b-0 sm:top-0 sm:rounded-b-20 lg:absolute lg:left-16 lg:top-16 lg:h-[820px] lg:w-auto lg:!max-w-none xl:h-[958px]',
      false: 'relative',
    },
  },
})

const stylesScreenBackground = cva(
  [
    'flex w-full overflow-hidden px-5 py-6 sm:py-[65px] lg:max-w-[478px] xl:max-w-[582px]',
  ],
  {
    variants: {
      desktopImage: {
        true: 'h-auto justify-start bg-transparent pb-0 sm:justify-center lg:h-[864px] lg:justify-start lg:pb-6',
        false: 'h-auto justify-center',
      },
    },
  }
)

const Section = (props: Props) => {
  const {
    title,
    description,
    explanation,
    primarySlot = null,
    icon,
    secondary,
    secondarySlot = null,
    screenBackground = true,
    reverse = false,
    dark = false,
  } = props

  const lastWord = description.split(' ').pop()
  const descriptionWithoutLastWord = description
    .split(' ')
    .slice(0, -1)
    .join(' ')

  return (
    <div
      className={cx(
        'relative z-10',
        'container flex flex-col items-stretch justify-between py-12',
        'md:items-center xl:gap-10 xl:py-20 2xl:gap-[140px]',
        reverse ? 'xl:flex-row' : 'xl:flex-row-reverse'
      )}
    >
      {/* TEXT */}
      <div className="flex w-full flex-1 flex-col pb-12 md:min-w-[418px] xl:pb-0">
        <div className="mb-5">{icon && <Icon id={icon} />}</div>
        <div className="mb-1">
          <Text
            size={27}
            weight="semibold"
            color={dark ? '$white-100' : undefined}
          >
            {title}
          </Text>
        </div>

        <div className="relative mb-5 max-w-[418px] md:mb-16 xl:max-w-full">
          <p
            className={cx(
              'text-27 font-regular',
              dark ? 'text-white-80' : 'text-neutral-100'
            )}
          >
            {description && explanation ? (
              <>
                {descriptionWithoutLastWord + ' '}
                <span className="relative whitespace-nowrap">
                  {lastWord}
                  <Explanation {...explanation} />
                </span>
              </>
            ) : (
              description
            )}
          </p>

          {primarySlot}
        </div>

        <div
          className={cx(
            'flex flex-col rounded-20 border border-dashed',
            dark
              ? 'border-white-10 bg-neutral-80/20'
              : 'border-neutral-80/20 bg-white-20'
          )}
        >
          <div
            className={cx(
              'flex flex-col divide-y divide-dashed',
              dark ? 'divide-white-10' : 'divide-neutral-80/20'
            )}
          >
            {secondary.map(item => (
              <div key={item.title} className="p-4">
                <p
                  className={cx(
                    'text-19 font-semibold',
                    dark ? 'text-white-100' : ''
                  )}
                >
                  {item.title}
                </p>
                <div className="flex pt-1">
                  <p
                    className={cx(
                      'text-19 font-regular',
                      dark ? 'text-white-80' : 'text-neutral-100'
                    )}
                  >
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {secondarySlot}
        </div>
      </div>

      {/* ASSET */}
      {screenBackground ? (
        <ScreenBackground
          className={stylesScreenBackground({
            desktopImage: props.desktopImage,
          })}
        >
          {props.image && (
            <>
              <ScreenImage
                {...props.image}
                className={stylesScreenImages({
                  desktopImage: props.desktopImage,
                })}
              />
              {props.desktopImage && (
                <div className="absolute left-0 top-0 z-[-3] size-full bg-customisation-50/10" />
              )}
            </>
          )}
          {props.video && (
            <ScreenVideo {...props.video} className="w-full max-w-[334px]" />
          )}
        </ScreenBackground>
      ) : (
        <div
          className={cx([
            'flex max-w-[582px] flex-1 justify-center overflow-hidden',
            dark &&
              'rounded-[26px] border border-white-5 bg-neutral-80/30 backdrop-blur-[20px]',
          ])}
        >
          {props.image && <Image {...props.image} />}
        </div>
      )}
    </div>
  )
}

export { Section }
