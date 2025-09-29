import 'react'

import type { CustomisationColorType } from '@status-im/components'

declare module 'react' {
  interface HTMLAttributes<T> extends AriaAttributes, DOMAttributes<T> {
    'data-theme'?: 'dark' | 'light'
    'data-background'?: 'blur'
    'data-customisation'?: CustomisationColorType
  }
}
