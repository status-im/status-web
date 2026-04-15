import { useAssets } from '@/hooks/use-assets'
import { useWallet } from '@/providers/wallet-context'

const DEFAULT_SUMMARY = {
  total_balance: 0,
  total_eur: 0,
  total_eur_24h_change: 0.0,
  total_percentage_24h_change: 0.0,
}

const MOCK_ACCOUNT = {
  emoji: '🍑',
  color: 'magenta',
  name: 'Account 1',
}

const usePortfolio = () => {
  const {
    currentWallet,
    currentAccount,
    isLoading: isWalletLoading,
  } = useWallet()

  const { data: assetsData, isLoading: isAssetsLoading } = useAssets({
    address: currentAccount?.address,
    isWalletLoading,
  })

  const account = {
    ...MOCK_ACCOUNT,
    // TODO: Use currently selected account name instead when multi-account support is implemented.
    name: currentWallet?.name ?? MOCK_ACCOUNT.name,
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
