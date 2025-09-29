'use client'

import { Button, useToast } from '@status-im/components'
import { CopyIcon } from '@status-im/icons/20'

import { useCopyToClipboard } from '~hooks/use-copy-to-clipboard'

type Props = {
  hex: string
}

export const CopyHexButton = (props: Props) => {
  const { hex } = props

  const [, copy] = useCopyToClipboard()

  const toast = useToast()

  const handleCopy = (hex: string) => {
    copy(hex.toUpperCase())

    toast.positive('Color copied!')
  }

  return (
    <Button
      variant="outline"
      onClick={() => handleCopy(hex)}
      //   variant={invert ? 'outline' : 'darkOutline'}
      icon={<CopyIcon />}
      aria-label="Copy hex"
    />
  )
}
