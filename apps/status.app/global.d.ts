import type * as React from 'react'

// why: https://github.com/mdx-js/mdx/issues/2487#issuecomment-2407661869
// why: https://react.dev/blog/2024/04/25/react-19-upgrade-guide#the-jsx-namespace-in-typescript
declare global {
  namespace JSX {
    // type ElementClass = React.JSX.ElementClass
    type Element = React.JSX.Element
    type IntrinsicElements = React.JSX.IntrinsicElements
  }

  interface Window {
    umami: {
      track: (event: string, data?: Record<string, unknown>) => void
    }
  }
}

declare module 'framer-motion' {
  export interface MotionProps {
    className?: string
  }
}
