'use client'

import { useEffect, useState } from 'react'

import { Button } from '@status-im/components'
import { CheckIcon, CopyIcon } from '@status-im/icons/20'
import { onlyText } from 'react-children-utilities'

import { useCopyToClipboard } from '../../_hooks/use-copy-to-clipboard'

export function CodeBlock(props: React.ComponentProps<'div'>) {
  const [, copy] = useCopyToClipboard()

  // note: https://github.com/atomiks/rehype-pretty-code/issues/34#issuecomment-1529567170 source
  const code = onlyText(props.children)

  const [success, setSuccess] = useState(false)

  useEffect(() => {
    setTimeout(() => setSuccess(false), 1500)
  }, [success])

  return (
    <div>
      <div className="relative my-5 grid scrollbar-none [&>pre]:max-h-[624px] [&>pre]:rounded-12 [&>pre]:bg-neutral-90 [&>pre]:p-6">
        <div className="absolute right-3 top-3 block" data-theme="dark">
          <Button
            variant="outline"
            onClick={() => {
              copy(code)
              setSuccess(true)
            }}
            icon={success ? <CheckIcon /> : <CopyIcon />}
            aria-label="Copy code"
          />
        </div>
        {props.children}
      </div>
    </div>
  )
}
