import { useEffect, useState } from 'react'

import { useToast } from '@status-im/components'
import { ERROR_MESSAGES } from '@status-im/wallet/constants'

export const useRecoveryPhraseBackup = () => {
  const toast = useToast()
  const [needsBackup, setNeedsBackup] = useState<boolean>(false)
  const [showRecoveryDialog, setShowRecoveryDialog] = useState<boolean>(false)

  const markAsBackedUp = async () => {
    try {
      await chrome.storage.local.remove(['recovery-phrase:needs-backup'])
      setNeedsBackup(false)
    } catch (error) {
      console.error('Failed to mark recovery phrase as backed up', error)
      toast.negative(ERROR_MESSAGES.RECOVERY_PHRASE_BACKUP, {
        duration: 3000,
      })
    }
  }

  const markAsNeedsBackup = async () => {
    try {
      await chrome.storage.local.set({ 'recovery-phrase:needs-backup': true })
      setNeedsBackup(true)
    } catch (error) {
      console.error('Failed to mark recovery phrase as needing backup', error)
    }
  }

  useEffect(() => {
    async function checkSettings() {
      try {
        const { 'recovery-phrase:needs-backup': needsBackup } =
          await chrome.storage.local.get(['recovery-phrase:needs-backup'])
        if (needsBackup) {
          setNeedsBackup(true)
          return
        }
        setNeedsBackup(false)
      } catch (error) {
        console.error('Failed to get recovery phrase backup status', error)
        setNeedsBackup(false)
      }
    }

    checkSettings()
  }, [])

  return {
    needsBackup,
    markAsBackedUp,
    markAsNeedsBackup,
    showRecoveryDialog,
    setShowRecoveryDialog,
  }
}
