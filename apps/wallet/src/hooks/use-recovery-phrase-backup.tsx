import { useEffect, useState } from 'react'

export const useRecoveryPhraseBackup = () => {
  const [isRecoveryPhraseBackedUp, setIsRecoveryPhraseBackedUp] =
    useState<boolean>(true)
  const [showRecoveryDialog, setShowRecoveryDialog] = useState<boolean>(false)

  const markAsBackedUp = async () => {
    setIsRecoveryPhraseBackedUp(true)

    await chrome.storage.local.set({ recoveryPhraseBackedUp: true })
  }

  useEffect(() => {
    async function checkSettings() {
      const { recoveryPhraseBackedUp } = await chrome.storage.local.get([
        'recoveryPhraseBackedUp',
      ])
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
