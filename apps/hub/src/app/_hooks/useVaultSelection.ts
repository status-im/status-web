import { useMemo, useState } from 'react'

import { type Vault, VAULTS } from '~constants/index'

import { useVaultRefetch } from './useVaultRefetch'
import { useVaultsAPR } from './useVaultsAPR'

export function useVaultSelection() {
  const [selectedVault, setSelectedVault] = useState<Vault | null>(null)
  const { registerRefetch, refetchVault } = useVaultRefetch()
  const { data: aprMap } = useVaultsAPR()

  const defaultVault = VAULTS.find(v => v.id === 'SNT') ?? VAULTS[0]

  const activeVaults = useMemo(() => {
    if (!aprMap) return VAULTS
    return VAULTS.filter(v => v.address.toLowerCase() in aprMap)
  }, [aprMap])

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
