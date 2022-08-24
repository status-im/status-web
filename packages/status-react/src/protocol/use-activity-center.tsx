import { useEffect, useState } from 'react'

import { useProtocol } from './provider'

import type { ActivityCenterLatest } from '@status-im/js'

export const useActivityCenter = () => {
  const { activityCenter } = useProtocol()

  const [latest, setData] = useState<ActivityCenterLatest>(() =>
    activityCenter.getLatest()
  )

  useEffect(() => {
    setData(activityCenter.getLatest())

    const handleUpdate = (latest: ActivityCenterLatest) => {
      setData(latest)
    }

    return activityCenter.onChange(handleUpdate)
    // todo?: add latest.unreadChats and latest.notifications, will it render unnecessarily
  }, [activityCenter])

  return {
    activityCenter,
    unreadChats: latest.unreadChats,
  }
}
