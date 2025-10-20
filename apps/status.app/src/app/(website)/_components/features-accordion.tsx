'use client'
import { useEffect, useState } from 'react'

import * as Accordion from '@radix-ui/react-accordion'
import { Text } from '@status-im/components'
import { cx } from 'class-variance-authority'

import { Icon, ScreenImage, ScreenVideo } from '~components/assets'

import { ColorTheme } from './color-theme'
import { ScreenBackground } from './screen-background'

import type { CustomisationColorType } from '@status-im/components'
import type { ImageId, ImageType, VideoId } from '~components/assets'

type Props = {
  items: Array<{
    title: string
    description: string
    iconId: ImageId
    image: ImageType
    video?: {
      id: VideoId
      posterId: ImageId
    }
    theme: CustomisationColorType
  }>
}

const LineDivider = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" width="944" height="2">
    <path
      stroke="currentColor"
      strokeDasharray="3 4"
      strokeLinecap="round"
      d="M1 1h944"
    />
  </svg>
)

// Interval in milliseconds
const TIME_INTERVAL = 17600
const TIME_INTERVAL_STEP = 50

const FeaturesAccordion = (props: Props) => {
  const { items } = props
  const [value, setValue] = useState(items[0].title)
  const [width, setWidth] = useState(0)

  const selected = items.find(item => item.title === value)!

  // Make the accordion change the selected item with a time interval of 5 seconds
  useEffect(() => {
    let counter = 0

    const interval = setInterval(() => {
      if (counter >= TIME_INTERVAL) {
        const index = items.findIndex(item => item.title === value)
        if (index === items.length - 1) {
          setValue(items[0].title)
        } else {
          setValue(items[index + 1].title)
        }
        counter = 0
        setWidth(0)
      } else {
        counter += TIME_INTERVAL_STEP
        // Calculate the width base on the counter.
        const newWidth = (counter * 100) / TIME_INTERVAL
        setWidth(newWidth)
      }
    }, TIME_INTERVAL_STEP)

    return () => clearInterval(interval)
  }, [items, value])

  return (
    <ColorTheme
      theme={selected.theme}
      className="container flex items-center justify-center px-5 sm:px-10 xl:px-20 2xl:px-0"
    >
      <div
        className={cx([
          'flex flex-col items-center justify-center gap-12 xl:flex-row xl:gap-16 2xl:gap-[120px]',
        ])}
      >
        <ScreenBackground className="w-full flex-1 grow-[2] p-6 xl:max-w-[348px] xl:py-6 2xl:max-w-[572px] 2xl:py-12">
          {selected.video ? (
            <ScreenVideo
              posterId={selected.video.posterId}
              id={selected.video.id}
              className="w-full max-w-[334px]"
            />
          ) : (
            <ScreenImage {...selected.image} className="w-full max-w-[334px]" />
          )}
        </ScreenBackground>
        <Accordion.Root
          type="single"
          value={value}
          onValueChange={val => {
            setValue(val)
          }}
          className="flex flex-col gap-5 pt-24 xl:flex-1 xl:gap-5 xl:pt-0"
        >
          {items.map(item => {
            const isOpen = value === item.title

            return (
              <Accordion.Item key={item.title} value={item.title}>
                <Accordion.Trigger disabled={isOpen}>
                  <div className="relative flex items-center justify-center">
                    {selected.title === item.title && (
                      <Icon
                        id={item.iconId}
                        className="absolute left-0 top-0 hidden translate-x-[calc(-100%-20px)] min-[1440px]:block"
                      />
                    )}
                    <p
                      className={cx(
                        'open:bg-blur-neutral-90/70',
                        'pb-6 text-left text-27 font-semibold xl:text-40 xl:font-bold',
                        !isOpen && 'hover:opacity-[50%]'
                      )}
                    >
                      {item.title}
                    </p>
                  </div>
                </Accordion.Trigger>
                <Accordion.Content>
                  <div className="pb-5 pt-1 lg:pb-8">
                    <Text size={19}>{item.description}</Text>
                  </div>
                </Accordion.Content>
                {/* Dashded divider with filling color synced with time */}
                <div className="relative w-full">
                  <div
                    className="absolute left-0 top-0 z-[2] text-neutral-100"
                    style={{
                      opacity: isOpen ? 1 : 0,
                      width: `${width}%`,
                    }}
                  >
                    <LineDivider />
                  </div>
                  <div className="absolute left-0 top-0 z-[1] w-full overflow-hidden text-neutral-100 opacity-[20%]">
                    <LineDivider />
                  </div>
                </div>
              </Accordion.Item>
            )
          })}
        </Accordion.Root>
      </div>
    </ColorTheme>
  )
}

export { FeaturesAccordion }
export type { Props as FeaturesAccordionProps }
