import { useEffect, useState } from 'react'

import { useToast } from '@status-im/components'
import { ERROR_MESSAGES } from '@status-im/wallet/constants'

export const useRecoveryPhraseBackup = () => {
  const toast = useToast()
  const [isRecoveryPhraseBackedUp, setIsRecoveryPhraseBackedUp] =
    useState<boolean>(true)
  const [showRecoveryDialog, setShowRecoveryDialog] = useState<boolean>(false)

  const markAsBackedUp = async () => {
    try {
      await chrome.storage.local.set({ 'recovery-phrase:backed-up': true })
      setIsRecoveryPhraseBackedUp(true)
    } catch (error) {
      console.error('Failed to mark recovery phrase as backed up', error)
      toast.negative(ERROR_MESSAGES.RECOVERY_PHRASE_BACKUP, {
        duration: 3000,
      })
    }
  }

  useEffect(() => {
    async function checkSettings() {
      try {
        const { 'recovery-phrase:backed-up': recoveryPhraseBackedUp } =
          await chrome.storage.local.get(['recovery-phrase:backed-up'])
        if (recoveryPhraseBackedUp) {
          setIsRecoveryPhraseBackedUp(true)
          return
        }
        setIsRecoveryPhraseBackedUp(false)
      } catch (error) {
        console.error('Failed to get recovery phrase backup status', error)
        setIsRecoveryPhraseBackedUp(false)
      }
    }

    checkSettings()
  }, [])

  return {
    isRecoveryPhraseBackedUp,
    markAsBackedUp,
    showRecoveryDialog,
    setShowRecoveryDialog,
  }
}
