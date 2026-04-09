import { useEffect, useState } from 'react'

import { Button, Switch } from '@status-im/components'
import { ArrowLeftIcon } from '@status-im/icons/20'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { storage } from '@wxt-dev/storage'

import { NOTIFICATIONS_ENABLED_KEY } from '@/lib/storage-keys'

export const Route = createFileRoute('/settings/')({
  component: SettingsPage,
})

function SettingsPage() {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true)
  const [isLoaded, setIsLoaded] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    storage
      .getItem<boolean>(NOTIFICATIONS_ENABLED_KEY)
      .then(value => {
        setNotificationsEnabled(value ?? true)
      })
      .catch(error => {
        console.error('Failed to load notification setting', error)
        setNotificationsEnabled(true)
      })
      .finally(() => {
        setIsLoaded(true)
      })
  }, [])

  const handleToggle = async (checked: boolean) => {
    setNotificationsEnabled(checked)
    await storage.setItem(NOTIFICATIONS_ENABLED_KEY, checked)
  }

  const handleBack = () => {
    if (window.history.length > 1) {
      window.history.back()
      return
    }

    navigate({ to: '/portfolio/assets' })
  }

  if (!isLoaded) return null

  return (
    <div className="flex flex-col gap-6 px-6 py-4">
      <div className="flex items-center gap-3">
        <Button
          variant="grey"
          icon={<ArrowLeftIcon color="$neutral-100" />}
          aria-label="Back"
          size="32"
          onPress={handleBack}
        />
        <h1 className="text-17 font-semibold text-neutral-100">Settings</h1>
      </div>
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
