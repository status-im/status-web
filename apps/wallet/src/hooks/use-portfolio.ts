import { useAssets } from '@/hooks/use-assets'
import { useWallet } from '@/providers/wallet-context'

const DEFAULT_SUMMARY = {
  total_balance: 0,
  total_eur: 0,
  total_eur_24h_change: 0.0,
  total_percentage_24h_change: 0.0,
}

const MOCK_ACCOUNT = {
  name: 'Account 1',
  emoji: '🍑',
  color: 'magenta',
}

const usePortfolio = () => {
  const { currentWallet, isLoading: isWalletLoading } = useWallet()

  const { data: assetsData, isLoading: isAssetsLoading } = useAssets({
    address: currentWallet?.activeAccounts[0]?.address,
    isWalletLoading,
  })

  const account = {
    ...MOCK_ACCOUNT,
    name: currentWallet?.name || MOCK_ACCOUNT.name,
  }

  const summary = assetsData?.summary || DEFAULT_SUMMARY
  const isLoading = isWalletLoading || isAssetsLoading

  return {
    currentWallet,
    account,
    summary,
    assetsData,
    isWalletLoading,
    isAssetsLoading,
    isLoading,
  }
}

export { usePortfolio }
