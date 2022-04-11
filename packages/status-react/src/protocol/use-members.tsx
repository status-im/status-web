import { useEffect, useRef, useState } from 'react'

import { useClient } from './provider'

interface State {
  fetching: boolean
  stale: boolean
  data?: any
  error?: Error
}

export const useMembers = (): State => {
  const isMounted = useRef(true)
  const client = useClient()

  const [state, setState] = useState<State>({
    fetching: false,
    stale: false,
    data: undefined,
    error: undefined,
  })

  useEffect(() => {
    isMounted.current = true
    return () => {
      isMounted.current = false
    }
  }, [])

  return state
}
