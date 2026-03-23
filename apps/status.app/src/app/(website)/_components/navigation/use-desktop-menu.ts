import { useEffect, useRef, useState } from 'react'

const useDesktopMenu = () => {
  const [value, setValue] = useState<string>('')
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const contentHoverTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  const handleTriggerMouseEnter = (nextValue: string) => {
    hoverTimeoutRef.current = setTimeout(() => {
      setValue(nextValue)
    }, 130)
  }

  const handleTriggerWithKeyboard = (nextValue: string) => {
    setValue(nextValue)
  }

  const handleTriggerMouseLeave = () => {
    clearTimeout(hoverTimeoutRef.current!)
  }

  const handleContentMouseEnter = () => {
    clearTimeout(contentHoverTimeoutRef.current!)
  }

  const handleContentMouseLeave = () => {
    contentHoverTimeoutRef.current = setTimeout(() => {
      setValue('')
    }, 130)
  }

  const handleContentLeave = () => {
    setValue('')
  }

  const handleTriggerKeyDown = (
    event: React.KeyboardEvent<HTMLButtonElement>,
    nextValue: string
  ) => {
    if (event.key === 'Enter' || event.key === ' ') {
      handleTriggerWithKeyboard(nextValue)
    }

    if (event.key === 'Escape') {
      handleContentLeave()
    }
  }

  useEffect(() => {
    return () => {
      clearTimeout(hoverTimeoutRef.current!)
      clearTimeout(contentHoverTimeoutRef.current!)
    }
  }, [])

  return {
    value,
    handleTriggerMouseEnter,
    handleTriggerMouseLeave,
    handleContentMouseEnter,
    handleContentMouseLeave,
    handleContentLeave,
    handleTriggerKeyDown,
  }
}

export { useDesktopMenu }
