'use client'

import { CheckIcon, CopyIcon } from '@status-im/icons/20'
import { Button } from '~app/_components/button'
import { useCopyToClipboard } from '~hooks/use-copy-to-clipboard'
import { useEffect, useState } from 'react'

type Props = {
  hex: string
  invert?: boolean
}

export const CopyHexButton = (props: Props) => {
  const { hex, invert } = props

  const [copiedText, copy] = useCopyToClipboard()
  const [copied, setCopied] = useState(false)

  const handleCopy = (hex: string) => {
    copy(hex.toUpperCase())

    setCopied(true)
  }

  // Return to initial state after 1.5s
  useEffect(() => {
    if (copied) {
      const timeout = setTimeout(() => {
        setCopied(false)
      }, 1500)

      return () => clearTimeout(timeout)
    }
  }, [copied])

  return (
    <Button
      variant={invert ? 'white' : 'secondary'}
      onClick={() => handleCopy(hex)}
      icon={copied && copiedText ? <CheckIcon /> : <CopyIcon />}
      aria-label="Copy hex"
      className="!px-[9.334px]"
    />
  )
}
