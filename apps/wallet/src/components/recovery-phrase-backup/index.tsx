'use client'
import { useState } from 'react'

import { useToast } from '@status-im/components'
import { NegativeStateIcon } from '@status-im/icons/20'
import { RecoveryPhraseDialog } from '@status-im/wallet/components'
import { ERROR_MESSAGES } from '@status-im/wallet/constants'

import { apiClient } from '@/providers/api-client'
import { usePassword } from '@/providers/password-context'
import { useWallet } from '@/providers/wallet-context'

import { useRecoveryPhraseBackup } from '../../hooks/use-recovery-phrase-backup'

export function RecoveryPhraseBackup() {
  const { currentWallet } = useWallet()
  const { requestPassword } = usePassword()
  const {
    needsBackup,
    showRecoveryDialog,
    setShowRecoveryDialog,
    markAsBackedUp,
  } = useRecoveryPhraseBackup()
  const [mnemonic, setMnemonic] = useState<string | null>(null)
  const toast = useToast()

  const handleBackupClick = async () => {
    if (!currentWallet?.id) {
      toast.negative(ERROR_MESSAGES.NO_WALLET_SELECTED, { duration: 3000 })
      return
    }

    try {
      const password = await requestPassword({
        title: 'Enter password',
        description: 'To view recovery phrase',
        requireFreshPassword: true,
      })

      if (!password) {
        return
      }

      const { mnemonic } = await apiClient.wallet.get.query({
        password,
        walletId: currentWallet.id,
      })

      setMnemonic(mnemonic)
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
    await markAsBackedUp()
    setMnemonic(null)
    toast.positive(
      'Your recovery phrase has been removed from this wallet interface.',
      { duration: 3000 },
    )
  }

  if (!needsBackup) {
    return null
  }

  return (
    <>
      <button
        onClick={handleBackupClick}
        className="flex gap-1 rounded-20 border border-solid border-danger-50/20 bg-danger-50/10 px-2 py-[3px] text-13 text-danger-50"
      >
        <NegativeStateIcon className="text-danger-50/20" /> Backup recovery
        phrase
      </button>

      <RecoveryPhraseDialog
        isOpen={showRecoveryDialog}
        onClose={onRecoveryClose}
        onComplete={onComplete}
        mnemonic={mnemonic}
      />
    </>
  )
}
