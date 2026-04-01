import { useEffect, useState } from 'react'

export function useTimeLeft(timeEndAt: number): number {
  const [timeLeft, setTimeLeft] = useState(timeEndAt - Math.floor(Date.now() / 1000))

  useEffect(() => {
    const timer = setInterval(() => setTimeLeft(timeEndAt - Math.floor(Date.now() / 1000)), 1000)

    return () => clearInterval(timer)
  }, [])

  return timeLeft
}
