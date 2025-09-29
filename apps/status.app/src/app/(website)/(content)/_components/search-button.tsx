'use client'

import { useState } from 'react'

import { Shortcut, Text } from '@status-im/components'
import { CommandIcon, SearchIcon } from '@status-im/icons/20'
import { cva } from 'class-variance-authority'

import { useKeyboardShortcuts } from '~hooks/use-keyboard-shortcuts'

import { FullscreenSearchDialog } from './fullscreen-search-dialog'

import type { VariantProps } from 'class-variance-authority'

export type SearchType = 'help' | 'specs'

type Props = {
  type: SearchType
  size: NonNullable<VariantProps<typeof styles>['size']>
}

export const SearchButton = (props: Props) => {
  const { type, size } = props

  const [open, setOpen] = useState(false)

  useKeyboardShortcuts({
    '$mod+K': () => setOpen(true),
  })

  return (
    <FullscreenSearchDialog type={type} open={open} onOpenChange={setOpen}>
      <button className={styles({ size })}>
        <span className="flex items-center gap-1">
          <SearchIcon className="text-neutral-50" />
          <Text size={15} weight="medium">
            Search
          </Text>
        </span>

        <span className="invisible flex gap-0.5 lg:visible">
          <Shortcut variant="secondary" icon={<CommandIcon />} />
          <Shortcut variant="secondary" symbol="K" />
        </span>
      </button>
    </FullscreenSearchDialog>
  )
}

const styles = cva(
  'inline-flex w-full items-center rounded-12 border border-neutral-20 shadow-1 lg:w-auto ',
  {
    variants: {
      size: {
        38: 'h-[38px] gap-4 px-3',
        32: 'h-[32px] gap-2 px-2',
      },
    },
  }
)
