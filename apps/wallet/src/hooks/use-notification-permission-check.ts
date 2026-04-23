import { useEffect } from 'react'

import { useToast } from '@status-im/components'
import { storage } from '@wxt-dev/storage'

import { NOTIFICATION_PROMPTED_KEY } from '../lib/storage-keys'

export function useNotificationPermissionCheck() {
  const toast = useToast()

  useEffect(() => {
    storage.getItem<boolean>(NOTIFICATION_PROMPTED_KEY).then(prompted => {
      if (prompted) return

      storage.setItem(NOTIFICATION_PROMPTED_KEY, true)
      toast.positive(
        'To receive transaction alerts, make sure notifications are enabled for this browser in System Settings.',
      )
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
}
