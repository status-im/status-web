import { useEffect, useState } from 'react'

import { Switch } from '@status-im/components'
import { createFileRoute } from '@tanstack/react-router'
import { storage } from '@wxt-dev/storage'

import { NOTIFICATIONS_ENABLED_KEY } from '@/lib/storage-keys'

export const Route = createFileRoute('/settings/')({
  component: SettingsPage,
})

function SettingsPage() {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true)
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    storage.getItem<boolean>(NOTIFICATIONS_ENABLED_KEY).then(value => {
      setNotificationsEnabled(value ?? true)
      setIsLoaded(true)
    })
  }, [])

  const handleToggle = async (checked: boolean) => {
    setNotificationsEnabled(checked)
    await storage.setItem(NOTIFICATIONS_ENABLED_KEY, checked)
  }

  if (!isLoaded) return null

  return (
    <div className="flex flex-col gap-6 px-6 py-4">
      <h1 className="text-17 font-semibold text-neutral-100">Settings</h1>
      <div className="rounded-2xl flex items-center justify-between bg-neutral-5 px-4 py-3">
        <div className="flex flex-col gap-0.5">
          <span className="text-15 font-medium text-neutral-100">
            Transaction notifications
          </span>
          <span className="text-13 text-neutral-40">
            Show alerts when transactions are sent or confirmed
          </span>
        </div>
        <Switch checked={notificationsEnabled} onCheckedChange={handleToggle} />
      </div>
    </div>
  )
}
