'use client'

import { useCallback, useEffect, useState } from 'react'

import { usePathname, useRouter, useSearchParams } from 'next/navigation'

// note: use transition for a loading toast?
export function useQueryState<T extends string | string[]>(
  key: string,
  initialValue: T
) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const [value, setValue] = useState<T>(() => {
    const paramValue = searchParams?.get(key) ?? ''
    return parseValue(paramValue, initialValue)
  })

  // todo?: remove
  useEffect(() => {
    const paramValue = searchParams?.get(key) ?? ''

    const parsedValue = parseValue(paramValue, initialValue)

    // Perform a deep comparison for arrays or a simple comparison for strings
    const valuesAreEqual =
      Array.isArray(parsedValue) && Array.isArray(value)
        ? areArraysEqual(parsedValue, value)
        : parsedValue === value

    // Avoid unnecessary state updates
    if (!valuesAreEqual) {
      setValue(parsedValue)
    }
  }, [searchParams])

  const setQueryValue = useCallback(
    async (newValue: T) => {
      if (!searchParams) return

      const currentParams = new URLSearchParams(
        Array.from(searchParams.entries())
      )
      const serializedValue = serializeValue(newValue)

      if (serializedValue === '') {
        currentParams.delete(key)
      } else {
        currentParams.set(key, serializedValue)
      }

      const search = currentParams.toString()
      const query = search ? `?${search}` : ''
      // router.refresh()
      // router.push(`${pathname}${query}`, { scroll: false })
      // window.location.reload()
      // window.history.go()
      // note: https://www.youtube.com/watch?v=_L590u8-fgc
      window.history.replaceState(null, '', `${pathname}${query}`)
      // note: https://github.com/vercel/next.js/issues/62451
      // window.location.reload()
      // fixme: adjust for /collectibles too
      router.push(
        `${pathname.endsWith('/assets') ? pathname : pathname.split('/').slice(0, -1).join('/')}${query}`,
        { scroll: false }
      )
      router.refresh()
      // router.refresh()
      // router.replace(`${pathname}${query}`, { scroll: false })
      await new Promise(resolve => setTimeout(resolve, 100))
      router.push(`${pathname}${query}`, { scroll: false })
      router.refresh()
      // window.location.reload()

      setValue(!newValue.length ? initialValue : newValue)
    },
    [key, pathname, router, searchParams, initialValue]
  )

  return [value, setQueryValue] as const
}

// Utils
function areArraysEqual<T>(arr1: T[], arr2: T[]): boolean {
  if (arr1.length !== arr2.length) return false
  return arr1.every((value, index) => value === arr2[index])
}

function serializeValue<T>(value: T): string {
  return Array.isArray(value) ? value.join(',') : (value as string)
}

function parseValue<T>(value: string | null, initialValue: T): T {
  return Array.isArray(initialValue)
    ? value?.length !== 0
      ? (value?.split(',') as T)
      : initialValue
    : ((value || initialValue) as T)
}
