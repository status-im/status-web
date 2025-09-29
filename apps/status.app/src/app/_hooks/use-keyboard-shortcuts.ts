import { useEffect } from 'react'

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { tinykeys } from 'tinykeys'

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import type { KeyBindingMap } from 'tinykeys'

export function useKeyboardShortcuts(map: KeyBindingMap) {
  useEffect(() => {
    return tinykeys(window, map)
  })
}
