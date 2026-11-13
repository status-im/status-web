import { useEffect, useState } from 'react'

/**
 * How long a confirm button stays inert after the popup is shown. Long enough
 * to swallow the tail of a double click or a burst of clicks started on the
 * dApp page (OS double-click intervals default to ~500 ms), short enough that
 * a person reading the request never notices.
 */
export const ACTIVATION_DELAY_MS = 500

/**
 * Returns false until the window has been visible and focused for `delay` ms.
 * Restarts whenever the window loses and regains focus or visibility, so a
 * click aimed at another window cannot land on whatever the popup puts under
 * the cursor. Restarts as well when `enabled` goes from false to true.
 */
export function useActivationDelay(
  enabled = true,
  delay = ACTIVATION_DELAY_MS,
): boolean {
  const [isActive, setIsActive] = useState(false)

  useEffect(() => {
    setIsActive(false)
    if (!enabled) return

    let timer: ReturnType<typeof setTimeout> | undefined

    const stop = () => {
      clearTimeout(timer)
      timer = undefined
      setIsActive(false)
    }

    const restart = () => {
      stop()
      if (document.visibilityState === 'hidden') return
      timer = setTimeout(() => setIsActive(true), delay)
    }

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') stop()
      else restart()
    }

    restart()
    window.addEventListener('focus', restart)
    window.addEventListener('blur', stop)
    document.addEventListener('visibilitychange', handleVisibilityChange)

    return () => {
      clearTimeout(timer)
      window.removeEventListener('focus', restart)
      window.removeEventListener('blur', stop)
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [enabled, delay])

  return isActive
}
