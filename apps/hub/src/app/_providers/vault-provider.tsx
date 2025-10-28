'use client'

import { ActionStatusDialog } from '../_components/stake/action-status-dialog'
import { useActionStatusContent } from '../_components/stake/hooks/use-action-status-content'
import { useVaultStateContext } from '../_hooks/useVaultStateContext'

export const VaultProvider = ({ children }: { children: React.ReactNode }) => {
  const { state: vaultState, reset: resetVault } = useVaultStateContext()
  const dialogContent = useActionStatusContent(vaultState)

  // Only render dialog in DOM if state is not idle
  const shouldRenderDialog =
    vaultState.type !== 'idle' && dialogContent !== null

  return (
    <>
      {children}

      {shouldRenderDialog ? (
        <ActionStatusDialog
          open={true}
          onClose={resetVault}
          {...dialogContent}
        />
      ) : null}
    </>
  )
}
