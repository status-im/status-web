import { Button } from '@status-im/components'
import { ArrowRightIcon, ExternalIcon } from '@status-im/icons/20'
import Link from 'next/link'

import type { IconComponentType } from '~app/_types'

type Props = {
  icon: IconComponentType
  title: string
  description: string
  href: string
  hrefLabel?: string
}

export const Card = (props: Props) => {
  const { href, hrefLabel, title, description, icon: Icon } = props

  const external = href.startsWith('https')

  return (
    <Link
      href={href}
      className="flex select-none flex-col justify-between rounded-20 border border-neutral-10 p-4 shadow-1 transition duration-100 hover:scale-[1.01] hover:shadow-3"
      {...(external && {
        rel: 'noopener noreferrer',
        target: '_blank',
      })}
    >
      <div>
        <div className="mb-3 flex size-10 items-center justify-center rounded-12 border border-neutral-10 bg-neutral-2.5">
          <Icon />
        </div>
        <div className="mb-5 flex flex-col gap-1">
          <p className="text-19 font-600">{title}</p>
          <p className="text-15">{description}</p>
        </div>
      </div>

      <div className="flex">
        {hrefLabel ? (
          <Button variant="outline" size="32" iconAfter={<ExternalIcon />}>
            {hrefLabel}
          </Button>
        ) : (
          <Button
            variant="outline"
            icon={<ArrowRightIcon />}
            aria-label="Go to page"
          />
        )}
      </div>
    </Link>
  )
}
