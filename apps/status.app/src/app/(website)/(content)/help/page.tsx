import { Button, Tag, Text } from '@status-im/components'
import { ArrowRightIcon, ExternalIcon } from '@status-im/icons/20'
import Link from 'next/link'

import { METADATA } from '~/config/help/metadata'
import { ROUTES } from '~/config/routes'
import { Metadata } from '~app/_metadata'
import { Icon } from '~components/assets'
import { Body } from '~components/body'

import { SearchButton } from '../_components/search-button'

export const metadata = Metadata({
  title: 'Help',
  description: 'Short-form guides on how to set up and use the app.',
})

export default function HelpPage() {
  return (
    <Body>
      <div className="container pb-5 pt-12 xl:pb-12 xl:pt-20">
        <div className="mb-10 flex flex-col items-start justify-between gap-5 xl:mb-20 xl:flex-row xl:items-end xl:gap-0">
          <div className="flex flex-col gap-2">
            <h1 className="text-40 font-bold xl:text-64">Let’s help you</h1>
            <Text size={19}>
              Short-form guides on how to set up and use the app
            </Text>
          </div>
          <SearchButton type="help" size={38} />
        </div>

        <div className="grid grid-cols-1 gap-5 xl:grid-cols-3">
          {Object.values(METADATA).map(
            ({ icon, title, description, href, beta }) => {
              return (
                <Link
                  href={href}
                  key={title}
                  className="flex flex-col rounded-20 border border-neutral-10 p-4 shadow-1 transition duration-100 hover:scale-[1.01] hover:shadow-3"
                >
                  <div className="mb-3">
                    <Icon priority id={icon} />
                  </div>
                  <div className="mb-5 grid flex-1 content-start gap-1">
                    <div className="flex items-center gap-2">
                      <Text size={19} weight="semibold">
                        {title}
                      </Text>
                      {beta && <Tag size="24" label="Beta" />}
                    </div>
                    <Text size={15}>{description}</Text>
                  </div>

                  <div className="flex">
                    <Button
                      variant="outline"
                      size="32"
                      iconAfter={<ArrowRightIcon />}
                    >
                      Learn more
                    </Button>
                  </div>
                </Link>
              )
            }
          )}
        </div>
      </div>

      <div className="border-t border-dashed border-neutral-30 py-12 xl:py-10">
        <div className="container flex flex-col items-start">
          <div className="mb-4 flex flex-col">
            <Text size={19} weight="semibold">
              {'Didn’t find answers?'}
            </Text>
            <Text size={15}>Ask around in our forum!</Text>
          </div>

          <Button
            variant="outline"
            size="32"
            iconAfter={<ExternalIcon />}
            href={ROUTES.Collaborate.find(r => r.name === 'Discuss')!.href}
          >
            Go to Discuss
          </Button>
        </div>
      </div>
    </Body>
  )
}
