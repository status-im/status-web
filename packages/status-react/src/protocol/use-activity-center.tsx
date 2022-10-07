import { useEffect, useState } from 'react'

import { useProtocol } from './use-protocol'

import type { ActivityCenterLatest } from '@status-im/js'

export const useActivityCenter = () => {
  const { client } = useProtocol()

  const [latest, setData] = useState<ActivityCenterLatest>(() =>
    client.activityCenter.getLatest()
  )

  useEffect(() => {
    setData(client.activityCenter.getLatest())

    const handleUpdate = (latest: ActivityCenterLatest) => {
      setData(latest)
    }

    return client.activityCenter.onChange(handleUpdate)
  }, [client.activityCenter])

  return {
    activityCenter: client.activityCenter,
    notifications: latest.notifications,
    unreadChats: latest.unreadChats,
    totalCount: latest.totalCount,
  }
}
