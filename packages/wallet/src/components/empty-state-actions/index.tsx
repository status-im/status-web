import { BuyTokens } from './components/buy-tokens'
import { DepositTokens } from './components/deposit-tokens'

type Props = {
  address: string
}

const EmptyStateActions = (props: Props) => {
  const { address } = props

  return (
    <div className="flex max-h-[calc(100vh-56px)] flex-col gap-4 overflow-y-auto p-8 scrollbar-stable">
      <BuyTokens address={address} />
      <DepositTokens address={address} />
    </div>
  )
}

export { EmptyStateActions }
