import { useEffect } from 'react'

import tinykeys from 'tinykeys'

import type { KeyBindingMap } from 'tinykeys'

export function useKeyboardShortcuts(map: KeyBindingMap) {
  useEffect(() => {
    return tinykeys(window, map)
  })
}
