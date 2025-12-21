import { useState } from 'react'

import { type Vault, VAULTS } from '~constants/index'

import { useVaultRefetch } from './useVaultRefetch'

export function useVaultSelection() {
  const [selectedVault, setSelectedVault] = useState<Vault | null>(null)
  const { registerRefetch, refetchVault } = useVaultRefetch()

  const defaultVault = VAULTS.find(v => v.id === 'SNT') ?? VAULTS[0]
  const activeVaults = VAULTS.filter(v => !v.soon)

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
