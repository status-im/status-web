import { BuyTokens } from './components/buy-tokens'
import { DepositTokens } from './components/deposit-tokens'

type Props = {
  address: string
}

const DefaultTokenDetail = (props: Props) => {
  const { address } = props

  return (
    <div className="flex flex-col gap-4 p-8">
      <BuyTokens />
      <DepositTokens address={address} />
    </div>
  )
}

export { DefaultTokenDetail }
