'use client'

import { usePreDepositActionStatusContent } from '~components/pre-deposit/hooks/use-pre-deposit-action-status-content'
import { ActionStatusDialog } from '~components/stake/action-status-dialog'
import { usePreDepositStateContext } from '~hooks/usePreDepositStateContext'

export const PreDepositProvider = ({
  children,
}: {
  children: React.ReactNode
}) => {
  const { state: preDepositState, reset: resetPreDeposit } =
    usePreDepositStateContext()
  const dialogContent = usePreDepositActionStatusContent(preDepositState)
  const shouldRenderDialog =
    preDepositState.type !== 'idle' && dialogContent !== null

  return (
    <>
      {children}

      {shouldRenderDialog ? (
        <ActionStatusDialog
          open={true}
          onClose={resetPreDeposit}
          {...dialogContent}
        />
      ) : null}
    </>
  )
}
