'use client'

import { useParams } from 'next/navigation'

import { capitalizeFirstLetter } from '~app/_utils/capitalize-first-letter'
import { Body } from '~components/body'
import { Breadcrumbs } from '~components/breadcrumbs'
import specsMetadataJson from '~content/metadata/specs.metadata.json'
import { SidebarMenu } from '~website/_components/sidebar-menu'
import { SearchButton } from '~website/(content)/_components/search-button'

import type { SidebarMenuProps } from '~website/_components/sidebar-menu'

type Props = {
  children: React.ReactNode
}

type SpecMetadata = {
  href: string
  title: string
  status: string
}

const specsMetadata: Record<string, SpecMetadata> = specsMetadataJson

export default function SpecsLayout({ children }: Props) {
  const params = useParams() as { slug: string[] }

  const spec = (Object.values(specsMetadata) as SpecMetadata[]).find(
    spec => spec.href === '/specs/' + params.slug.join('/')
  )!

  return (
    <Body className="relative">
      {/* Header */}
      <Breadcrumbs
        items={[
          {
            label: 'Specs',
            href: '/specs',
          },
          {
            label: spec.title!, // SpecsDoc#computedFields.title
            href: spec.href,
          },
        ]}
        action={<SearchButton type="specs" size={32} />}
      />

      <div className="flex items-stretch">
        {/* Menu */}
        <div className="border-r border-neutral-10">
          <div className="sticky top-0 hidden lg:block">
            <SidebarMenu
              items={[
                ...Object.entries(specsMetadata)
                  .reduce((acc, [, metadata]) => {
                    const { status, title = '', href } = metadata
                    const item = acc.get(status)

                    if (!item) {
                      const newItem = {
                        label: capitalizeFirstLetter(status),
                        href: href,
                        links: [{ label: title, href: href }],
                      }

                      return acc.set(status, newItem)
                    }

                    item.links!.push({
                      label: title,
                      href: href,
                    })

                    return acc.set(status, item)
                  }, new Map<string, SidebarMenuProps['items'][number]>())
                  .values(),
              ]}
            />
          </div>
        </div>

        {children}
      </div>
    </Body>
  )
}
