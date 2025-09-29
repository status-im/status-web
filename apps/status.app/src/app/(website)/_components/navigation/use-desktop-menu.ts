import { useEffect, useRef, useState } from 'react'

const useDesktopMenu = () => {
  const [value, setValue] = useState<string>('')
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const contentHoverTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  const handleTriggerMouseEnter = (e?: React.MouseEvent<HTMLElement>) => {
    const target = e?.target as HTMLElement
    const menuItemText = target.textContent || ''

    hoverTimeoutRef.current = setTimeout(() => {
      setValue(menuItemText)
    }, 130)
  }

  const handleTriggerWithKeyboard = (e: React.KeyboardEvent<HTMLElement>) => {
    const target = e.target as HTMLElement
    const menuItemText = target.textContent || ''

    setValue(menuItemText)
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
    event: React.KeyboardEvent<HTMLButtonElement>
  ) => {
    if (event.key === 'Enter' || event.key === ' ') {
      handleTriggerWithKeyboard(event)
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
