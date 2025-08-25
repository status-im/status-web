import { ExternalIcon } from '@status-im/icons/12'
import { cx } from 'class-variance-authority'

import { Image, type ImageId } from '../../image'

type Props = {
  address: string
}

const BuyTokens = (props: Props) => {
  const { address } = props

  const PROVIDERS: ProviderProps[] = [
    {
      name: 'MoonPay',
      image: 'Wallet/Icons/Logos/moonpay-bigger:144:144',
      list: [
        'Pay with Credit/Debit Card, Bank Transfer, Apple/Google Pay, SEPA, +9 more',
        'Fees: from 1%',
        'Supported Countries: 180',
      ],
      url: 'https://buy.moonpay.com/v2/buy?apiKey=pk_live_YQC6CQPA5qqDu0unEwHJyAYQyeIqFGR',
    },
    {
      name: 'Mercuryo',
      image: 'Wallet/Icons/Logos/mercuryo-bigger:144:144',
      list: [
        'Pay with Credit/Debit Card, Bank Transfer, Apple/Google Pay, SEPA, +10 more',
        'Fees: from 1%',
        'Supported Countries: 135+',
      ],
      url: `https://exchange.mercuryo.io/?type=buy&network=ETHEREUM&currency=ETH&address=${address}&hide_address=false&fix_address=true&widget_id=6a7eb330-2b09-49b7-8fd3-1c77cfb6cd47`,
    },
  ]

  return (
    <div className="flex flex-col items-start justify-start gap-4 rounded-16 bg-customisation-blue-50/5">
      <div className="flex flex-col gap-1 p-4 pb-1">
        <span className="text-19 font-600 text-neutral-100">
          Ways to buy tokens
        </span>
        <p className="text-15 font-400 text-neutral-100">
          Credit card and bank transfer
        </p>
      </div>
      <div className="flex gap-3 p-3">
        {PROVIDERS.map(provider => (
          <Provider key={provider.name} {...provider} />
        ))}
      </div>
    </div>
  )
}

type ProviderProps = {
  name: string
  image: ImageId
  list: string[]
  url: string
}

const Provider = (props: ProviderProps) => {
  const { name, image, list, url } = props

  return (
    <div className="flex flex-col items-center justify-center gap-2 rounded-16 bg-white-100 p-4">
      <div className="flex flex-col items-center justify-center gap-2">
        <Image id={image} className="size-[72px]" />
        <h2 className="text-15 font-600">{name}</h2>
      </div>
      <ul className="mt-2 items-start text-13/[21px] font-400 text-neutral-50">
        {list.map(item => (
          <li key={item} className="ml-3 list-disc">
            {item}
          </li>
        ))}
      </ul>
      <div className="flex items-center justify-center">
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className={cx(
            'inline-flex h-6 shrink-0 cursor-pointer items-center justify-center gap-1',
            'rounded-8 border border-neutral-30 bg-transparent px-2 pr-[6px] text-13 font-500 text-neutral-100 outline-none transition-all',
            'active:border-neutral-20 active:bg-neutral-10 active:text-neutral-100 hover:border-neutral-40',
            'focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-80 focus-visible:ring-offset-2',
            'disabled:cursor-default disabled:opacity-[.3]',
          )}
        >
          Go to {name}
          <ExternalIcon className="shrink-0 text-neutral-50 [&>svg]:size-full" />
        </a>
      </div>
    </div>
  )
}

export { BuyTokens }
