import { useEffect, useState } from 'react'

import { useProtocol } from './provider'

interface Result {
  data: any
}

export const useActivityCenter = (): Result => {
  const { client } = useProtocol()

  const activityCenter = client.activityCenter

  const [data, setData] = useState<any>(() => activityCenter.getLatest())

  useEffect(() => {
    setData(activityCenter.getLatest())

    const handleUpdate = (latest: any) => {
      setData(latest)
    }

    return activityCenter.onChange(handleUpdate)
  }, [activityCenter])

  return {
    data,
  }
}
