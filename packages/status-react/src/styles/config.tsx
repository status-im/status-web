import { createStitches } from '@stitches/react'

import type { CSS as StitchesCSS } from '@stitches/react'

export type { VariantProps } from '@stitches/react'
export type CSS = StitchesCSS<typeof config>

export const { styled, css, keyframes, theme, createTheme, config } =
  createStitches({
    prefix: 'status',
    theme: {
      fonts: {
        sans: 'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"',
        mono: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
      },
      fontWeights: {
        400: '400',
        500: '500',
        600: '600',
      },
      colors: {
        white: '#fff',
      },
      space: {
        1: '4px',
        2: '8px',
        3: '16px',
        4: '20px',
        5: '24px',
        6: '32px',
        7: '48px',
        8: '64px',
        9: '80px',
      },
      radii: {
        8: '8px',
        full: '100%',
      },
    },

    media: {
      medium: '(min-width: 500px)',
      large: '(min-width: 736px)',

      motion: '(prefers-reduced-motion: no-preference)',
    },
  })
