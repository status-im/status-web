import { useCallback, useRef } from 'react'

import type { Vault } from '~constants/index'

export function useVaultRefetch() {
  const refetchFunctionsRef = useRef<Record<string, () => void>>({})

  const registerRefetch = useCallback(
    (vaultId: string, refetch: () => void) => {
      refetchFunctionsRef.current[vaultId] = refetch
    },
    []
  )

  const refetchVault = useCallback((vault: Vault | null) => {
    if (vault) {
      refetchFunctionsRef.current[vault.id]?.()
    }
  }, [])

  return { registerRefetch, refetchVault }
}
