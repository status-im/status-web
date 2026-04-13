import { getProviderUrl, ProviderCard, PROVIDERS } from '../../provider-card'

type Props = {
  address: string
}

const BuyTokens = (props: Props) => {
  const { address } = props

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
          <ProviderCard
            key={provider.name}
            {...provider}
            href={getProviderUrl(provider.name, address)}
          />
        ))}
      </div>
    </div>
  )
}

export { BuyTokens }
