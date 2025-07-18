'use client'
import { useEffect, useState } from 'react'

import { useToast } from '@status-im/components'
import { NegativeStateIcon } from '@status-im/icons/20'
import {
  RecoveryPhraseDialog,
  SignTransactionDialog,
} from '@status-im/wallet/components'
import { ERROR_MESSAGES } from '@status-im/wallet/constants'

import { apiClient } from '@/providers/api-client'
import { useWallet } from '@/providers/wallet-context'

export function RecoveryPhraseBackup() {
  const { currentWallet, mnemonic, setMnemonic } = useWallet()
  const [showRecoveryDialog, setShowRecoveryDialog] = useState(false)
  const toast = useToast()

  useEffect(() => {
    if (mnemonic) {
      const handleBeforeUnload = (e: BeforeUnloadEvent) => {
        e.preventDefault()
        return "You haven't backed up your wallet! Your recovery phrase will be lost forever."
      }

      window.addEventListener('beforeunload', handleBeforeUnload)
      return () =>
        window.removeEventListener('beforeunload', handleBeforeUnload)
    }
  }, [mnemonic])

  const onPasswordConfirm = async (password: string) => {
    if (!currentWallet?.id) {
      toast.negative(ERROR_MESSAGES.NO_WALLET_SELECTED, { duration: 3000 })
      return
    }

    try {
      await apiClient.wallet.get.query({
        password: password,
        walletId: currentWallet?.id,
      })

      setShowRecoveryDialog(true)
    } catch (error) {
      console.error(error)
      toast.negative(ERROR_MESSAGES.INVALID_PASSWORD, {
        duration: 3000,
      })
    }
  }

  const onRecoveryClose = () => {
    setShowRecoveryDialog(false)
  }

  const onComplete = async () => {
    setMnemonic(null)
    toast.positive(
      'Your recovery phrase has been deleted from the wallet interface.',
      { duration: 3000 },
    )
  }

  if (!mnemonic) {
    return null
  }

  return (
    <>
      <SignTransactionDialog
        onConfirm={onPasswordConfirm}
        description="To backup recovery phrase"
      >
        <button className="flex gap-1 rounded-20 border border-solid border-danger-50/20 bg-danger-50/10 px-2 py-[3px] text-13 text-danger-50">
          <NegativeStateIcon className="text-danger-50/20" /> Backup recovery
          phrase
        </button>
      </SignTransactionDialog>

      <RecoveryPhraseDialog
        isOpen={showRecoveryDialog}
        onClose={onRecoveryClose}
        onComplete={onComplete}
        mnemonic={mnemonic}
      />
    </>
  )
}
