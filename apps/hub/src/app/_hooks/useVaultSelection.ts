import { useCallback, useMemo, useState } from 'react'

import { type Vault, VAULTS } from '~constants/index'

import { useVaultRefetch } from './useVaultRefetch'
import { useVaultsAPY } from './useVaultsAPY'

type ModalType = 'deposit' | 'unlock' | 'claim'

type ActiveModal = {
  type: ModalType
  vault: Vault
} | null

export function useVaultSelection() {
  const [activeModal, setActiveModal] = useState<ActiveModal>(null)
  const { registerRefetch, refetchVault } = useVaultRefetch()
  const { data: apyMap } = useVaultsAPY()

  const defaultVault = VAULTS.find(v => v.id === 'SNT') ?? VAULTS[0]

  const activeVaults = useMemo(() => {
    if (!apyMap) return VAULTS
    return VAULTS.filter(v => v.address.toLowerCase() in apyMap)
  }, [apyMap])

  const depositVault =
    activeModal?.type === 'deposit' ? activeModal.vault : null
  const unlockVault = activeModal?.type === 'unlock' ? activeModal.vault : null
  const claimVault = activeModal?.type === 'claim' ? activeModal.vault : null

  const openDepositModal = useCallback(
    (vault: Vault) => setActiveModal({ type: 'deposit', vault }),
    []
  )
  const openUnlockModal = useCallback(
    (vault: Vault) => setActiveModal({ type: 'unlock', vault }),
    []
  )
  const openClaimModal = useCallback(
    (vault: Vault) => setActiveModal({ type: 'claim', vault }),
    []
  )

  const closeModal = useCallback(() => setActiveModal(null), [])

  const handleDepositSuccess = () => refetchVault(depositVault)
  const handleUnlockSuccess = () => refetchVault(unlockVault)
  const handleClaimSuccess = () => refetchVault(claimVault)

  return {
    activeModal,
    depositVault,
    unlockVault,
    claimVault,
    defaultVault,
    activeVaults,
    registerRefetch,
    openDepositModal,
    openUnlockModal,
    openClaimModal,
    closeModal,
    handleDepositSuccess,
    isDepositModalOpen: activeModal?.type === 'deposit',
    isUnlockModalOpen: activeModal?.type === 'unlock',
    isClaimModalOpen: activeModal?.type === 'claim',
    handleUnlockSuccess,
    handleClaimSuccess,
  }
}
