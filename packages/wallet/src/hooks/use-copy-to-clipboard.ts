import { useState } from 'react'

type CopiedValue = string | null
type CopyFunction = (text: string) => Promise<boolean>

export function useCopyToClipboard(): [CopiedValue, CopyFunction] {
  const [copiedText, setCopiedText] = useState<CopiedValue>(null)

  const copy: CopyFunction = async text => {
    if (!navigator?.clipboard) {
      console.warn('Clipboard not supported')
      return false
    }

    try {
      await navigator.clipboard.writeText(text)
      setCopiedText(text)
      return true
    } catch (error) {
      console.warn('Copy failed', error)
      setCopiedText(null)
      return false
    }
  }

  return [copiedText, copy]
}
