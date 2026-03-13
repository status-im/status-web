'use client'

import { Button, useToast } from '@status-im/components'
import { CopyIcon } from '@status-im/icons/20'
import { useTranslations } from 'next-intl'

import { useCopyToClipboard } from '~hooks/use-copy-to-clipboard'

type Props = {
  hex: string
}

export const CopyHexButton = (props: Props) => {
  const { hex } = props

  const t = useTranslations('brand')
  const [, copy] = useCopyToClipboard()

  const toast = useToast()

  const handleCopy = (hex: string) => {
    copy(hex.toUpperCase())

    toast.positive(t('colorCopied'))
  }

  return (
    <Button
      variant="outline"
      onClick={() => handleCopy(hex)}
      //   variant={invert ? 'outline' : 'darkOutline'}
      icon={<CopyIcon />}
      aria-label={t('copyHex')}
    />
  )
}
