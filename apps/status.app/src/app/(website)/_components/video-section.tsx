import { PopupIcon } from '@status-im/icons/20'
import { cx } from 'class-variance-authority'

import { Explanation } from './explanation'

import type { ExplanationType } from './explanation'

type Props = {
  title: string
  titleSlot?: React.ReactNode
  description: string
  explanation?: ExplanationType
  secondarySlot?: React.ReactElement
  video: React.ReactNode
  circle?: React.ReactNode
  dark?: boolean
}

const VideoSection = (props: Props) => {
  const {
    title,
    titleSlot = null,
    circle,
    description,
    explanation,
    dark,
    secondarySlot,
    video,
  } = props

  return (
    <div className="container relative pb-12 pt-24 2md:flex xl:pb-40 xl:pt-60">
      {circle}
      <div className="relative z-20 pb-12 lg:pb-0">
        <div className="flex flex-col">
          <div className="flex max-w-full flex-col gap-4 2md:max-w-[330px] lg:max-w-[380px] xl:max-w-[480px]">
            <h2
              className={cx(
                'text-40 font-bold xl:text-64',
                dark && 'text-white-100'
              )}
            >
              {title}
              {titleSlot}
            </h2>
            <p className={cx('text-27', dark && 'text-white-80')}>
              {description}
            </p>

            {secondarySlot && <div className="pt-8">{secondarySlot}</div>}
            {explanation && (
              <div className="mt-4">
                <Explanation
                  title={explanation.title}
                  description={explanation.description}
                >
                  <button className="flex items-center justify-center gap-1 self-start rounded-12 border border-neutral-80 py-[9px] pl-4 pr-3 text-15 font-medium text-white-100">
                    Read more <PopupIcon className="text-neutral-40" />
                  </button>
                </Explanation>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="relative z-0 flex max-h-max min-w-[430px] flex-1 justify-end xl:-mr-10">
        <div
          className={cx([
            'relative -top-5 -mr-12 sm:-mr-20 2md:absolute 2md:right-[-120px] 2md:top-[-90px] 2md:mr-0 xl:right-[-80px] 2xl:right-[-240px] 2xl:top-[-180px]',
            '2md:[&_video]:max-h-[451px] xl:[&_video]:max-h-[449px] 2xl:[&_video]:max-h-[624px]',
          ])}
        >
          {video}
        </div>
      </div>
    </div>
  )
}

export { VideoSection }
