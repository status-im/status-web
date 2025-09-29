import { cx } from 'class-variance-authority'

import { Image } from '~components/assets'
import { features } from '~website/_features'

import { ColorTheme } from './color-theme'
import { FeatureTag } from './feature-tag'
import { ScreenBackground } from './screen-background'

import type { FeatureType } from '~website/_features'

type FeatureSectionProps = {
  type: FeatureType
  title: string
  description: string
  children?: React.ReactNode
  divider?: boolean
  beta?: boolean
}

const FeatureSection = (props: FeatureSectionProps) => {
  const {
    type,
    title,
    description,
    children,
    divider = false,
    beta = false,
  } = props

  const feature = features[type]

  return (
    <ColorTheme
      theme={feature.theme}
      className={cx(
        'relative overflow-hidden',
        divider && 'border-b border-dashed border-neutral-10'
      )}
    >
      <section className="container-lg relative grid gap-12 pb-20 pt-24 lg:gap-20 lg:pb-20 lg:pt-40">
        <div className="relative z-[14] flex max-w-[500px] flex-col items-start justify-start">
          <div className="flex flex-col items-start gap-4">
            <div className="relative">
              <FeatureTag type={type} />
              {beta && (
                <Image
                  id="Non Beta Release/Scribbles and Notes/01_Beta:154:41"
                  alt=""
                  width={51}
                  height={13}
                  aria-hidden
                  className="absolute right-[-60px] top-[10px] z-10"
                />
              )}
            </div>
            <h2 className="whitespace-pre-line text-40 font-bold lg:text-64">
              {title}
            </h2>
            <p className="text-27 font-regular">{description}</p>
          </div>
        </div>

        {children && (
          <div className="relative grid grid-cols-1 gap-3 xl:grid-cols-3 xl:gap-5">
            {children}
          </div>
        )}
      </section>
    </ColorTheme>
  )
}

type FeatureSectionColumnProps = {
  children?: React.ReactNode
}

const FeatureSectionColumn = (props: FeatureSectionColumnProps) => {
  return (
    <div className="relative z-[14] grid grid-flow-row gap-3 xl:gap-5">
      {props.children}
    </div>
  )
}

type FeatureSectionItemProps = {
  label?: string | React.ReactNode
  reverse?: boolean
  screenBackground?: boolean
  withBlur?: boolean
  className?: string
  wrapperClassName?: string
  textClassName?: string
  imageWrapperClassName?: string
  children?: React.ReactNode
}

const FeatureSectionItem = (props: FeatureSectionItemProps) => {
  const {
    children,
    className,
    label,
    reverse,
    screenBackground,
    wrapperClassName,
    withBlur,
    textClassName,
    imageWrapperClassName,
  } = props

  if (screenBackground) {
    return (
      <ScreenBackground
        className={cx([
          'relative p-6 sm:py-12 lg:p-8 xl:mx-auto 2xl:px-16 2xl:py-12',
          className,
        ])}
      >
        <div
          className={cx(
            'max-w-[310px] sm:max-w-[264px] lg:max-w-[280px] 2xl:max-w-[384px]',
            imageWrapperClassName
          )}
        >
          {children}
        </div>
      </ScreenBackground>
    )
  }

  return (
    <div
      className={cx(
        'relative flex justify-between rounded-[32px] border border-neutral-80/10 bg-white-40 xl:rounded-20 2xl:rounded-[32px]',
        reverse ? 'flex-col-reverse' : 'flex-col',
        withBlur && 'backdrop-blur-[20px]',
        wrapperClassName
      )}
    >
      <div className="flex justify-center">
        <h3
          className={cx([
            textClassName,
            'w-full max-w-[320px] p-6 text-center text-27 font-semibold sm:text-19 2xl:max-w-[410px] 2xl:text-27',
          ])}
        >
          {label}
        </h3>
      </div>

      <div className={cx(['z-10 flex w-full justify-center', className])}>
        <div
          className={cx([
            'max-w-[310px] md:max-w-[264px] xl:max-w-[280px] 2xl:max-w-[413px]',
            imageWrapperClassName,
          ])}
        >
          {children}
        </div>
      </div>
    </div>
  )
}

FeatureSection.Column = FeatureSectionColumn
FeatureSection.Item = FeatureSectionItem

export { FeatureSection }
