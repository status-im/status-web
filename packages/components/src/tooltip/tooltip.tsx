'use client'

import React, { useState } from 'react'

import * as Tooltip from '@radix-ui/react-tooltip'
import { cx } from 'cva'

type Props = Omit<Tooltip.TooltipContentProps, 'content'> & {
  delayDuration?: number
  children: React.ReactElement
  content: React.ReactNode
}

const _Tooltip = (props: Props) => {
  const {
    children,
    content,
    delayDuration = 0,
    sideOffset = 8,
    ...contentProps
  } = props

  // note: for keeping "_" in component's name
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [open, setOpen] = useState(false)

  return (
    <Tooltip.Provider>
      <Tooltip.Root
        open={open}
        onOpenChange={setOpen}
        delayDuration={delayDuration}
      >
        <Tooltip.Trigger asChild>
          {/* note: https://github.com/radix-ui/primitives/issues/1573#issuecomment-1698975904 */}
          {React.cloneElement(children, {
            onClick: (e: React.MouseEvent<HTMLElement>) => {
              const originalOnClick = (
                children.props as {
                  onClick?: (e: React.MouseEvent<HTMLElement>) => void
                }
              ).onClick

              if (originalOnClick) {
                originalOnClick(e)
              }

              setOpen(true)
            },
          } as Partial<React.HTMLAttributes<HTMLElement>>)}
        </Tooltip.Trigger>
        <Tooltip.Portal>
          <Tooltip.Content
            sideOffset={sideOffset}
            {...contentProps}
            className={cx(
              'z-50 cursor-default rounded-8 border border-neutral-10 bg-white-100 px-3 py-1.5 text-13 font-medium shadow-3',
              'dark:border-neutral-80 dark:bg-neutral-90 dark:text-white-100',
            )}
          >
            {content}
          </Tooltip.Content>
        </Tooltip.Portal>
      </Tooltip.Root>
    </Tooltip.Provider>
  )
}

export { _Tooltip as Tooltip }
export type { Props as TooltipProps }
