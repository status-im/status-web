'use client'

import { ExternalIcon } from '@status-im/icons/20'
import { TwitterIcon } from '@status-im/icons/social'
import { ButtonLink } from '@status-im/status-network/components'
import Image from 'next/image'

type Props = {
  name: string
  description: string
  website: string
  twitter?: string
  cover: string
  icon: string
}

function AppCard(props: Props) {
  const { name, description, website, twitter, cover, icon } = props

  return (
    <div className="flex h-full flex-col rounded-28 border border-neutral-20 bg-white-100 p-2 shadow-2 transition-colors hover:border-neutral-30">
      <div className="relative mb-4">
        <div className="flex aspect-[12/5] w-full items-center justify-center overflow-hidden rounded-24 bg-neutral-20">
          <Image
            src={cover}
            alt={name}
            fill
            className="overflow-hidden rounded-24 object-cover"
          />
        </div>
        <div className="absolute bottom-[-15px] left-2 flex size-20 items-center justify-center overflow-hidden rounded-24 bg-neutral-40 text-11 text-neutral-60">
          <Image src={icon} alt={name} fill className="object-cover" />
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-1 px-2 pb-2 pt-[10px]">
        <h3 className="mb-1 text-27 font-semibold text-neutral-90">{name}</h3>
        <p className="mb-auto text-15 font-400 text-neutral-100">
          {description}
        </p>
        <div className="mt-1 flex items-start gap-2">
          <ButtonLink
            href={website}
            target="_blank"
            rel="noopener noreferrer"
            variant="white"
            size="32"
          >
            {website.replace('https://', '')}{' '}
            <ExternalIcon className="size-4 text-neutral-50" />
          </ButtonLink>
          {twitter && (
            <ButtonLink
              href={`https://x.com/${twitter}`}
              target="_blank"
              rel="noopener noreferrer"
              variant="white"
              size="32"
            >
              <TwitterIcon className="size-4 text-neutral-50" />
            </ButtonLink>
          )}
        </div>
      </div>
    </div>
  )
}

function AppCardSkeleton() {
  return (
    <div className="rounded-28 border border-neutral-20 bg-white-100 p-2 shadow-2">
      <div className="relative mb-4">
        <div className="aspect-[12/5] w-full animate-skeleton overflow-hidden rounded-24 bg-gradient-to-r from-neutral-10 via-white-100 to-neutral-10 bg-[size:400%_400%]" />
        <div className="absolute bottom-[-15px] left-2 size-20 animate-skeleton rounded-24 bg-gradient-to-r from-neutral-20 via-white-100 to-neutral-20 bg-[size:400%_400%]" />
      </div>

      <div className="flex flex-col gap-1 px-2 pb-2 pt-[10px]">
        <div className="mb-1 h-8 w-3/4 animate-skeleton rounded-12 bg-gradient-to-r from-neutral-10 via-white-100 to-neutral-10 bg-[size:400%_400%]" />
        <div className="h-5 w-full animate-skeleton rounded-8 bg-gradient-to-r from-neutral-10 via-white-100 to-neutral-10 bg-[size:400%_400%]" />
        <div className="h-5 w-2/3 animate-skeleton rounded-8 bg-gradient-to-r from-neutral-10 via-white-100 to-neutral-10 bg-[size:400%_400%]" />
        <div className="mt-1 flex items-start gap-2">
          <div className="h-8 w-32 animate-skeleton rounded-12 bg-gradient-to-r from-neutral-10 via-white-100 to-neutral-10 bg-[size:400%_400%]" />
          <div className="size-8 animate-skeleton rounded-12 bg-gradient-to-r from-neutral-10 via-white-100 to-neutral-10 bg-[size:400%_400%]" />
        </div>
      </div>
    </div>
  )
}

export { AppCard, AppCardSkeleton }
