import { useEffect, useState } from 'react'

import { logger } from '~lib/logger'

export function useLocalStorage<T>(
  key: string,
  initialValue: T,
): [T, (value: T | ((val: T) => T)) => void] {
  const [storedValue, setStoredValue] = useState<T>(initialValue)

  useEffect(() => {
    try {
      const item = window.localStorage.getItem(key)
      setStoredValue(item ? JSON.parse(item) : initialValue)
    } catch (error) {
      logger.error(error)
      setStoredValue(initialValue)
    }
  }, [])

  useEffect(() => {
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === key) {
        setStoredValue(
          event.newValue ? JSON.parse(event.newValue) : initialValue,
        )
      }
    }

    window.addEventListener('storage', handleStorageChange)

    return () => {
      window.removeEventListener('storage', handleStorageChange)
    }
  }, [key, initialValue])

  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore =
        value instanceof Function ? value(storedValue) : value

      setStoredValue(valueToStore)
      window.localStorage.setItem(key, JSON.stringify(valueToStore))
      window.dispatchEvent(new Event('storage'))
    } catch (error) {
      logger.error(error)
    }
  }

  return [storedValue, setValue]
}
