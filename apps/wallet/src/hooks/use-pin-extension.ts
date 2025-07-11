import { useEffect, useState } from 'react'

export const usePinExtension = () => {
  const [isPinExtension, setIsPinExtension] = useState<boolean>(false)

  const handleClose = async () => {
    setIsPinExtension(false)
    await chrome.storage.local.set({ pinExtension: true })
  }

  useEffect(() => {
    async function checkSettings() {
      const storage = await chrome.storage.local.get(['pinExtension'])
      if (storage.pinExtension) {
        setIsPinExtension(false)
        return
      }

      const settings = await chrome.action.getUserSettings()
      setIsPinExtension(!settings.isOnToolbar)
    }

    checkSettings()
  }, [])

  return { isPinExtension, handleClose }
}
