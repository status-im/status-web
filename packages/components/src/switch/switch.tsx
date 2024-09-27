'use client'

import { forwardRef } from 'react'

import * as Switch from '@radix-ui/react-switch'
import { cva } from 'cva'

type Props = Switch.SwitchProps & {
  checked: boolean
  onCheckedChange: (checked: boolean) => void
}

const Root = forwardRef<React.ElementRef<typeof Switch.Root>, Props>(
  (props, ref) => {
    return (
      <Switch.Root {...props} ref={ref} className={rootStyles()}>
        <Switch.Thumb className={thumbStyles()} />
      </Switch.Root>
    )
  },
)

Root.displayName = Switch.Root.displayName

const rootStyles = cva({
  base: [
    'relative h-5 w-[30px] shrink-0 cursor-default rounded-full outline-none transition-colors',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-customisation-50 focus-visible:ring-offset-2',
    'bg-neutral-20 data-[state=checked]:bg-customisation-blue-50 hover:bg-neutral-30 data-[state=checked]:hover:bg-customisation-blue-60',
    'dark:bg-neutral-80 dark:data-[state=checked]:bg-customisation-blue-60 dark:hover:bg-neutral-70 dark:data-[state=checked]:hover:bg-customisation-blue-50 dark:focus-visible:ring-offset-neutral-80',
    'data-[disabled]:pointer-events-none data-[disabled]:opacity-[30%]',
  ],
})

const thumbStyles = cva({
  base: [
    'block size-4 rounded-full bg-white-100',
    'translate-x-0.5 transition-transform duration-100 data-[state=checked]:translate-x-[12px]',
  ],
})

export { Root as Switch }
export type { Props as SwitchProps }
