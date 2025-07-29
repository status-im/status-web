import { Button } from '@status-im/components'
import { ExternalIcon } from '@status-im/icons/20'

import { Image } from '../../image'

const PROVIDERS = [
  {
    name: 'MoonPay',
    image: 'Wallet/Icons/Logos/moonpay:64:64',
    list: [
      'Pay with Credit/Debit Card, Bank Transfer, Apple/Google Pay, SEPA, +9 more',
      'Fees: from 1%',
      'Supported Countries: 180',
    ],
    url: 'https://moonpay.com',
  },
  {
    name: 'Mercuryo',
    image: 'Wallet/Icons/Logos/mercuryo:64:64',
    list: [
      'Pay with Credit/Debit Card, Bank Transfer, Apple/Google Pay, SEPA, +10 more',
      'Fees: from 1%',
      'Supported Countries: 135+',
    ],
    url: 'https://mercuryo.io',
  },
]

const BuyTokens = () => {
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
        <Image id={image} className="size-16" />
        <h2 className="text-15 font-600">{name}</h2>
      </div>
      <ul className="mt-2 items-start text-13/5 font-400 text-neutral-50">
        {list.map(item => (
          <li key={item} className="ml-3 list-disc">
            {item}
          </li>
        ))}
      </ul>
      <div className="flex items-center justify-center">
        <Button
          href={url}
          iconAfter={<ExternalIcon />}
          variant="outline"
          size="24"
        >
          Go to {name}
        </Button>
      </div>
    </div>
  )
}

export { BuyTokens }
