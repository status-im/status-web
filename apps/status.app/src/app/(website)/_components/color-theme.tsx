import { forwardRef } from 'react'

import { customisation } from '@status-im/colors'

import type { CustomisationColorType } from '@status-im/components'

type Props = React.ComponentProps<'div'> & {
  theme: CustomisationColorType
  children: React.ReactNode
  className?: string
}

export const ColorTheme = forwardRef<HTMLDivElement, Props>((props, ref) => {
  const { theme, ...rest } = props

  return (
    <div
      {...rest}
      ref={ref}
      style={
        {
          '--screen-border': customisation[theme]['50/5'],
          '--circle-background': customisation[theme]['50'],
        } as React.CSSProperties
      }
      data-customisation={theme}
    />
  )
})

ColorTheme.displayName = 'ColorTheme'
