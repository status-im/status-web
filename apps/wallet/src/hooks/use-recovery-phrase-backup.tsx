import { useEffect, useState } from 'react'

export const useRecoveryPhraseBackup = () => {
  const [isRecoveryPhraseBackedUp, setIsRecoveryPhraseBackedUp] =
    useState<boolean>(true)
  const [showRecoveryDialog, setShowRecoveryDialog] = useState<boolean>(false)

  const markAsBackedUp = async () => {
    setIsRecoveryPhraseBackedUp(true)

    await chrome.storage.local.set({ 'recovery-phrase:backed-up': true })
  }

  useEffect(() => {
    async function checkSettings() {
      const { 'recovery-phrase:backed-up': recoveryPhraseBackedUp } =
        await chrome.storage.local.get(['recovery-phrase:backed-up'])
      if (recoveryPhraseBackedUp) {
        setIsRecoveryPhraseBackedUp(true)
        return
      }

      setIsRecoveryPhraseBackedUp(false)
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
