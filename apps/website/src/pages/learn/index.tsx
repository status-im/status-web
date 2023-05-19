import { Button, Shadow, Text } from '@status-im/components'
import { ArrowRightIcon, StatusIcon } from '@status-im/icons'

import { SearchButton } from '@/components/search-button'
import { AppLayout, PageBody } from '@/layouts/app-layout'

import type { Page } from 'next'

const LearnPage: Page = () => {
  return (
    <div className="[--max-width:1186px]">
      <PageBody>
        <div className="mx-auto max-w-[var(--max-width)] py-20">
          <div className="mb-20 flex items-end justify-between">
            <div>
              <h1 className="text-[64px] font-bold">{"Let's help you"}</h1>
              <Text size={19}>
                Technical, short form guides on how to setup and use the app
              </Text>
            </div>

            <SearchButton size={38} />
          </div>

          <div className="grid grid-cols-3 gap-5">
            {[...Array(6)].map((_, i) => (
              <Shadow
                key={i}
                className="border-neutral-10 flex rounded-[20px] border p-4"
              >
                <div className="mb-5 grid gap-1">
                  <Text size={19} weight="semibold">
                    Getting started
                  </Text>
                  <Text size={15}>
                    Find out what makes Status unique, run Status for the first
                    time and discover essential app features.
                  </Text>
                </div>

                <div className="flex">
                  <Button
                    variant="outline"
                    size={32}
                    iconAfter={<ArrowRightIcon size={20} color="$neutral-50" />}
                  >
                    Learn more
                  </Button>
                </div>
              </Shadow>
            ))}
          </div>
        </div>

        <div className="border-neutral-30 border-t border-dashed py-10">
          <div className="mx-auto flex max-w-[var(--max-width)] flex-col items-start">
            <div className="mb-4 flex flex-col">
              <Text size={19} weight="semibold">
                Didn’t find answers?
              </Text>
              <Text size={15}>Ask around in our community!</Text>
            </div>

            <Button
              variant="outline"
              size={32}
              iconAfter={<StatusIcon size={20} color="$neutral-50" />}
            >
              Say Hello in
            </Button>
          </div>
        </div>
      </PageBody>
    </div>
  )
}

LearnPage.getLayout = AppLayout

export default LearnPage
