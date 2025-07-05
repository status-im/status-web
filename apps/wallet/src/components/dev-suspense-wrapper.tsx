import { useEffect, useRef, useState } from 'react'

type Props = {
  children: React.ReactNode
  delayMs?: number
}

export function DevSuspenseWrapper({ children, delayMs = 3000 }: Props) {
  const [ready, setReady] = useState(false)
  const promiseRef = useRef<Promise<void> | null>(null)

  useEffect(() => {
    if (!ready) {
      if (!promiseRef.current) {
        promiseRef.current = new Promise(resolve => {
          setTimeout(() => {
            setReady(true)
            resolve()
          }, delayMs)
        })
      }
    }
  }, [ready, delayMs])

  if (!ready) {
    if (promiseRef.current) {
      throw promiseRef.current
    }
  }

  return <>{children}</>
}
