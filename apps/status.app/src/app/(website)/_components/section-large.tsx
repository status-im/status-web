import { Text } from '@status-im/components'
import { cx } from 'class-variance-authority'

import { Image } from '~components/assets'

import { DotsDivider } from './dots-divider'
import { Explanation } from './explanation'
import { FeatureTag } from './feature-tag'

import type { ExplanationType } from './explanation'
import type { FeatureType } from '~website/_features'

type Props = {
  title: string
  description: string
  description2?: string
  children: React.ReactNode
  dark?: boolean
  explanation?: ExplanationType
  featureType?: FeatureType
  beta?: boolean
}

export const SectionLarge = (props: Props) => {
  const {
    title,
    description,
    description2,
    children,
    dark = false,
    explanation,
    featureType,
    beta = false,
  } = props

  return (
    <div className="container relative z-10 pt-24 lg:pt-40">
      <div className="mx-auto flex max-w-[742px] flex-col items-center gap-4 px-5 pb-20 text-center">
        <div className="relative w-fit">
          {featureType && <FeatureTag type={featureType} />}
          {beta && (
            <Image
              id="Non Beta Release/Scribbles and Notes/01_Beta:154:41"
              alt=""
              className="absolute right-[-60px] top-[10px] z-10"
              width={51}
              height={13}
              aria-hidden
            />
          )}
        </div>
        <h2
          className={cx(
            'pb-4 text-40 font-bold lg:text-64',
            dark && 'text-white-100'
          )}
        >
          {title}
        </h2>
        <Text size={27} color={dark ? '$white-80' : undefined}>
          {description}
        </Text>
        {description2 && (
          <>
            <DotsDivider className="py-7" dark />
            <Text size={27} color={dark ? '$white-80' : undefined}>
              {description2}
              {explanation && <Explanation {...explanation} />}
            </Text>
          </>
        )}
      </div>
      {children}
    </div>
  )
}
