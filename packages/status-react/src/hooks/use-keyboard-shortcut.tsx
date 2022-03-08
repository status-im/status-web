import { useEffect } from 'react'

import tinykeys from 'tinykeys'

import type { KeyBindingMap } from 'tinykeys'

// docs: https://github.com/jamiebuilds/tinykeys#commonly-used-keys-and-codes
export const useKeyboardShortcuts = (keyBindingMap: KeyBindingMap) => {
  useEffect(() => {
    return tinykeys(window, keyBindingMap)
  })
}
