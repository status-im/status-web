'use client'
import { useState } from 'react'

import { useToast } from '@status-im/components'
import { NegativeStateIcon } from '@status-im/icons/20'
import {
  RecoveryPhraseDialog,
  SignTransactionDialog,
} from '@status-im/wallet/components'

import { useRecoveryPhraseBackup } from '@/hooks/use-recovery-phrase-backup'
import { apiClient } from '@/providers/api-client'
import { useWallet } from '@/providers/wallet-context'

export function RecoveryPhraseBackup() {
  const { currentWallet } = useWallet()
  const toast = useToast()

  const [mnemonic, setMnemonic] = useState<string | null>(null)
  const {
    isRecoveryPhraseBackedUp,
    showRecoveryDialog,
    setShowRecoveryDialog,
    markAsBackedUp,
  } = useRecoveryPhraseBackup()

  const onPasswordConfirm = async (password: string) => {
    if (!currentWallet?.id) {
      toast.negative('No wallet selected', { duration: 3000 })
      return
    }

    try {
      const { mnemonic } = await apiClient.wallet.get.query({
        password: password,
        walletId: currentWallet?.id,
      })
      setMnemonic(mnemonic)
      setShowRecoveryDialog(true)
    } catch (error) {
      console.error(error)
      toast.negative('Invalid password', {
        duration: 3000,
      })
    }
  }

  const onRecoveryClose = () => {
    setShowRecoveryDialog(false)
  }

  const onComplete = async () => {
    await markAsBackedUp()
  }

  if (isRecoveryPhraseBackedUp) {
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
