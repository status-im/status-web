import { useMemo, useState } from 'react'

import { type Vault, VAULTS } from '~constants/index'

import { useVaultRefetch } from './useVaultRefetch'
import { useVaultsAPY } from './useVaultsAPY'

export function useVaultSelection() {
  const [selectedVault, setSelectedVault] = useState<Vault | null>(null)
  const { registerRefetch, refetchVault } = useVaultRefetch()
  const { data: apyMap } = useVaultsAPY()

  const defaultVault = VAULTS.find(v => v.id === 'SNT') ?? VAULTS[0]

  const activeVaults = useMemo(() => {
    if (!apyMap) return VAULTS
    return VAULTS.filter(v => v.address.toLowerCase() in apyMap)
  }, [apyMap])

  const openModal = (vault: Vault) => setSelectedVault(vault)
  const closeModal = () => setSelectedVault(null)
  const handleDepositSuccess = () => refetchVault(selectedVault)

  return {
    selectedVault,
    setSelectedVault,
    defaultVault,
    activeVaults,
    registerRefetch,
    openModal,
    closeModal,
    handleDepositSuccess,
    isModalOpen: selectedVault !== null,
  }
}
