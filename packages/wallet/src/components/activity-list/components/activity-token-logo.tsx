import erc20TokenList from '../../../constants/erc20.json'

type ActivityTokenLogoProps = {
  symbol: string
  address: string
}

const ActivityTokenLogo = (props: ActivityTokenLogoProps) => {
  const { symbol, address } = props

  const getActivityTokenLogo = (symbol: string, contractAddress?: string) => {
    if (symbol === 'ETH') {
      return 'https://assets.coingecko.com/coins/images/279/large/ethereum.png'
    }

    const token = erc20TokenList.tokens.find(
      token =>
        token.symbol === symbol ||
        (contractAddress &&
          token.address.toLowerCase() === contractAddress.toLowerCase()),
    )

    return token?.logoURI ?? ''
  }

  const src = getActivityTokenLogo(symbol, address)

  if (!src) {
    return (
      <div className="flex size-8 flex-shrink-0 items-center justify-center rounded-full bg-neutral-10 text-11 font-600 text-neutral-50">
        {symbol.slice(0, 4).toUpperCase()}
      </div>
    )
  }

  return (
    <img
      className="size-8 flex-shrink-0 rounded-full bg-neutral-10"
      alt={symbol}
      src={src}
    />
  )
}

export { ActivityTokenLogo }
