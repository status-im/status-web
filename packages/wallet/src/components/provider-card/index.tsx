import { ExternalIcon } from '@status-im/icons/12'
import { cx } from 'class-variance-authority'

import { Image, type ImageId } from '../image'

export type ProviderInfo = {
  name: string
  image: ImageId
  list: string[]
}

export const PROVIDERS: ProviderInfo[] = [
  {
    name: 'MoonPay',
    image: 'Wallet/Icons/Logos/moonpay-bigger:144:144',
    list: [
      'Pay with Credit/Debit Card, Bank Transfer, Apple/Google Pay, SEPA, +9 more',
      'Fees: from 1%',
      'Supported Countries: 180',
    ],
  },
  {
    name: 'Mercuryo',
    image: 'Wallet/Icons/Logos/mercuryo-bigger:144:144',
    list: [
      'Pay with Credit/Debit Card, Bank Transfer, Apple/Google Pay, SEPA, +10 more',
      'Fees: from 1%',
      'Supported Countries: 135+',
    ],
  },
]

export const getProviderUrl = (
  provider: string,
  address?: string,
  options?: { network?: string; currency?: string },
): string => {
  const { network = 'ETHEREUM', currency = 'ETH' } = options ?? {}

  const urls: Record<string, string> = {
    moonpay:
      'https://buy.moonpay.com?apiKey=pk_live_YQC6CQPA5qqDu0unEwHJyAYQyeIqFGR',
    mercuryo: `https://exchange.mercuryo.io/?type=buy&network=${network}&currency=${currency}&address=${address}&hide_address=false&fix_address=true&widget_id=6a7eb330-2b09-49b7-8fd3-1c77cfb6cd47`,
  }

  return urls[provider.toLowerCase()] ?? ''
}

type ProviderCardProps = ProviderInfo & {
  href?: string
  onClick?: () => void
}

export const ProviderCard = (props: ProviderCardProps) => {
  const { name, image, list, href, onClick } = props

  const cardClassName =
    'flex flex-col items-center gap-2 rounded-16 border border-neutral-10 bg-white-100 p-4'

  const content = (
    <>
      <Image id={image} className="size-[72px]" />
      <h2 className="text-15 font-600">{name}</h2>
      <ul className="mt-2 w-full text-13/[21px] font-400 text-neutral-50">
        {list.map(item => (
          <li key={item} className="ml-3 list-disc text-left">
            {item}
          </li>
        ))}
      </ul>
    </>
  )

  if (onClick) {
    return (
      <button
        onClick={onClick}
        className={cx(
          cardClassName,
          'cursor-pointer transition-colors hover:bg-neutral-5',
        )}
      >
        {content}
      </button>
    )
  }

  return (
    <div className={cardClassName}>
      {content}
      <div className="flex items-center justify-center">
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className={cx(
            'inline-flex h-6 shrink-0 cursor-pointer items-center justify-center gap-1',
            'rounded-8 border border-neutral-30 bg-transparent px-2 pr-[6px] text-13 font-500 text-neutral-100 outline-none transition-all',
            'active:border-neutral-20 active:bg-neutral-10 active:text-neutral-100 hover:border-neutral-40',
            'focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-80 focus-visible:ring-offset-2',
          )}
        >
          Go to {name}
          <ExternalIcon className="shrink-0 text-neutral-50" />
        </a>
      </div>
    </div>
  )
}
