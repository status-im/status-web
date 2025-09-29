import { Button, Text } from '@status-im/components'
import { ArrowRightIcon } from '@status-im/icons/20'
import Link from 'next/link'

import { METADATA } from '~/config/specs/metadata'
import { Metadata } from '~app/_metadata'
import { Body } from '~components/body'
import specsMetadata from '~content/metadata/specs.metadata.json'

import { SearchButton } from '../_components/search-button'

export const metadata = Metadata({
  title: 'Specs',
  description:
    'Technical deep dives into the inner workings of the Status apps.',
})

export default function SpecsPage() {
  return (
    <Body>
      <div className="container pb-5 pt-12 xl:pb-12 xl:pt-20">
        <div className="mb-10 flex flex-col items-start justify-between gap-5 xl:mb-20 xl:flex-row xl:items-end xl:gap-0">
          <div className="flex flex-col gap-2">
            <h1 className="text-40 font-bold xl:text-64">Specs</h1>
            <Text size={19}>
              Technical deep dives into the inner workings of the Status apps
            </Text>
          </div>
          <SearchButton type="specs" size={38} />
        </div>

        <div className="grid grid-cols-1 gap-5 xl:grid-cols-3">
          {Object.keys(METADATA)
            .filter(key => specsMetadata[key as keyof typeof specsMetadata])
            .map(key => {
              const {
                title = '',
                description,
                href,
              } = specsMetadata[key as keyof typeof specsMetadata]

              return (
                <Link
                  href={href}
                  key={title}
                  className="flex flex-col rounded-20 border border-neutral-10 p-4 shadow-1 transition duration-100 hover:scale-[1.01] hover:shadow-3"
                >
                  <div className="mb-5 grid flex-1 content-start gap-1">
                    <Text size={19} weight="semibold">
                      {title}
                    </Text>
                    <Text size={15}>{description}</Text>
                  </div>

                  <div className="flex">
                    <Button
                      variant="outline"
                      size="32"
                      iconAfter={<ArrowRightIcon />}
                    >
                      Read
                    </Button>
                  </div>
                </Link>
              )
            })}
        </div>
      </div>
    </Body>
  )
}
