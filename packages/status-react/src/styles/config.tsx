import { createStitches } from '@stitches/react'

import type { CSS as StitchesCSS, VariantProps } from '@stitches/react'

export const {
  styled,
  css,
  keyframes,
  theme,
  createTheme,
  config,
  getCssText,
} = createStitches({
  // prefix: 'status',
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
      white: 'rgb(255, 255, 255)',
      black: 'rgb(0, 0, 0)',
      current: 'currentColor',
      transparent: 'transparent',

      background: 'rgb(255, 255, 255)',
      overlay: 'rgba(0, 0, 0, 0.4)',

      'primary-1': 'rgba(67, 96, 223, 1)',
      'primary-2': 'rgba(67, 96, 223, 0.2)',
      'primary-3': 'rgba(67, 96, 223, 0.1)',

      'gray-1': 'rgba(147, 155, 161, 1)',
      'gray-2': 'rgba(238, 242, 245, 1)',
      'gray-3': 'rgba(233, 237, 241, 1)',
      'gray-4': 'rgba(246, 248, 250, 1)',
      'gray-5': 'rgba(240, 242, 245, 1)',

      'danger-1': 'rgba(255, 45, 85, 1)',
      'danger-2': 'rgba(255, 45, 85, 0.2)',
      'danger-3': 'rgba(255, 45, 85, 0.1)',

      'success-1': 'rgba(78, 188, 96, 1)',
      'success-2': 'rgba(78, 188, 96, 0.1)',

      'mention-1': 'rgba(13, 164, 201, 1)',
      'mention-2': 'rgba(7, 188, 233, 0.3)',
      'mention-3': 'rgba(7, 188, 233, 0.2)',
      'mention-4': 'rgba(7, 188, 233, 0.1)',

      'pin-1': 'rgba(254, 143, 89, 1)',
      'pin-2': 'rgba(255, 159, 15, 0.2)',
      'pin-3': 'rgba(255, 159, 15, 0.1)',

      'navigate-2': 'rgba(255, 159, 15, 0.2)',

      'accent-1': 'rgba(0, 0, 0, 1)',
      'accent-2': 'rgba(0, 0, 0, 0.9)',
      'accent-3': 'rgba(0, 0, 0, 0.8)',
      'accent-4': 'rgba(0, 0, 0, 0.7)',
      'accent-5': 'rgba(0, 0, 0, 0.4)',
      'accent-6': 'rgba(0, 0, 0, 0.2)',
      'accent-7': 'rgba(0, 0, 0, 0.1)',
      'accent-8': 'rgba(0, 0, 0, 0.05)',
      'accent-9': 'rgba(255, 255, 255, 0.4)',
      'accent-10': 'rgba(255, 255, 255, 0.7)',
      'accent-11': 'rgba(255, 255, 255, 1)',

      blue: 'rgba(41, 70, 196, 1)',
      purple: 'rgba(136, 122, 249, 1)',
      cyan: 'rgba(81, 208, 240, 1)',
      violet: 'rgba(211, 126, 244, 1)',
      grep: 'rgba(250, 101, 101, 1)',
      yellow: 'rgba(255, 202, 15, 1)',
      grass: 'rgba(124, 218, 0, 1)',
      moss: 'rgba(38, 166, 154, 1)',
      vintage: 'rgba(139, 49, 49, 1)',
      kaki: 'rgba(155, 131, 47, 1)',
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
      1: '4px',
      2: '8px',
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

export const darkTheme = createTheme({
  colors: {
    background: 'rgb(0, 0, 0)',
    overlay: 'rgba(255, 255, 255, 0.4)',

    'primary-1': 'rgba(136, 176, 255, 1)',
    'primary-2': 'rgba(134, 158, 255, 0.3)',
    'primary-3': 'rgba(134, 158, 255, 0.2)',

    'gray-1': 'rgba(144, 144, 144, 1)',
    'gray-2': 'rgba(55, 55, 55, 1)',
    'gray-3': 'rgba(44, 44, 44, 1)',
    'gray-4': 'rgba(37, 37, 37, 1)',
    'gray-5': 'rgba(33, 33, 33, 1)',

    'danger-1': 'rgba(255, 92, 123, 1)',
    'danger-2': 'rgba(255, 92, 123, 0.3)',
    'danger-3': 'rgba(255, 92, 123, 0.2)',

    'success-1': 'rgba(96, 195, 112, 1)',
    'success-2': 'rgba(96, 195, 112, 0.2)',

    'mention-1': 'rgba(123, 229, 255, 1)',
    'mention-2': 'rgba(13, 164, 201, 0.3)',
    'mention-3': 'rgba(13, 164, 201, 0.2)',
    'mention-4': 'rgba(13, 164, 201, 0.1)',

    'pin-1': 'rgba(255, 166, 123, 1)',
    'pin-2': 'rgba(254, 143, 89, 0.2)',
    'pin-3': 'rgba(254, 143, 89, 0.1)',

    'accent-1': 'rgba(255, 255, 255, 1)',
    'accent-2': 'rgba(255, 255, 255, 0.9)',
    'accent-3': 'rgba(255, 255, 255, 0.8)',
    'accent-4': 'rgba(255, 255, 255, 0.7)',
    'accent-5': 'rgba(255, 255, 255, 0.4)',
    'accent-6': 'rgba(255, 255, 255, 0.2)',
    'accent-7': 'rgba(255, 255, 255, 0.1)',
    'accent-8': 'rgba(255, 255, 255, 0.05)',
    'accent-9': 'rgba(0, 0, 0, 0.4)',
    'accent-10': 'rgba(0, 0, 0, 0.7)',
    'accent-11': 'rgba(0, 0, 0, 1)',

    blue: 'rgba(170, 198, 255, 1)',
    purple: 'rgba(136, 122, 249, 1)',
    cyan: 'rgba(81, 208, 240, 1)',
    violet: 'rgba(211, 126, 244, 1)',
    grep: 'rgba(250, 101, 101, 1)',
    yellow: 'rgba(255, 202, 15, 1)',
    grass: 'rgba(147, 219, 51, 1)',
    moss: 'rgba(16, 168, 142, 1)',
    vintage: 'rgba(173, 67, 67, 1)',
    kaki: 'rgba(234, 210, 123, 1)',
  },
})

/**
 * Base styles.
 *
 * @see https://tailwindcss.com/docs/preflight for styles source
 * @see https://unpkg.com/tailwindcss@3.1.8/src/css/preflight.css for styles source
 * @see https://github.com/codesandbox/sandpack/blob/1778f245d0dff04dc2776b7420db5561874c7730/sandpack-react/src/styles/themeContext.tsx for styles source
 * @see https://caniuse.com/?search=%3Awhere() for browser support
 *
 * note: Check regurarly for changes in the upstreams.
 */
export const base = css({
  // note: following block is nested under `&` only for clarity, technically, properties could be spread
  '&': {
    // note: without this our main component overflows
    all: 'initial',
    '&::before, &::after': {
      boxSizing: 'border-box',
      borderWidth: 0,
      borderStyle: 'solid',
    },
    lineHeight: 1.5,
    '-webkit-text-size-adjust': '100%',
    '-moz-tab-size': 4,
    tabSize: 4,
    fontFamily: 'Inter, sans-serif',
    margin: 0,
    '&:-moz-focusring': {
      outline: 'auto',
    },
    '&:-moz-ui-invalid': {
      boxShadow: 'none',
    },
    '&::-webkit-inner-spin-button, &::-webkit-outer-spin-button': {
      height: 'auto',
    },
    '&::-webkit-search-decoration': {
      '-webkit-appearance': 'none',
    },
    '&::-webkit-file-upload-button': {
      '-webkit-appearance': 'button',
      font: 'inherit',
    },
    '&:disabled': {
      cursor: 'default',
    },
  },
  // todo?: move to the top
  '& :where(*)': {
    // todo?: add
    // all: 'initial',
    '-webkit-font-smoothing': 'antialiased',
    '&::-webkit-scrollbar': {
      // todo?: report unsupported typing in these blocks
      width: 0,
    },
    boxSizing: 'border-box',
    borderWidth: 0,
    borderStyle: 'solid',
  },
  /**
   * note: for specificity, `& :where(...)` leaves the class selector's (i.e. &) weight,
   * but nullifies it for the listed elements (i.e. :where()). Overriding by later set
   * properties thus still works (e.g. stiches component) as well as overriding of global
   * styles (e.g. tailwindcss) set by the context where would our main component be embedded.
   */
  '& :where(hr)': {
    height: 0,
    color: 'inherit',
    borderTopWidth: 1,
  },
  '& :where(abbr)': {
    '&:where([title])': {
      textDecoration: 'underline dotted',
    },
  },
  '& :where(h1, h2, h3, h4, h5, h6)': {
    fontSize: 'inherit',
    fontWeight: 'inherit',
  },
  '& :where(a)': {
    color: 'inherit',
    textDecoration: 'inherit',
  },
  '& :where(b, strong)': {
    fontWeight: 'bolder',
  },
  '& :where(code, kbd, samp, pre)': {
    fontFamily:
      'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
    fontSize: '1em',
  },
  '& :where(small)': {
    fontSize: '80%',
  },
  '& :where(sub, sup)': {
    fontSize: '75%',
    lineHeight: 0,
    position: 'relative',
    verticalAlign: 'baseline',
  },
  '& :where(sub)': {
    bottom: '-0.25em',
  },
  '& :where(sup)': {
    top: '-0.5em',
  },
  '& :where(table)': {
    textIndent: 0,
    borderColor: 'inherit',
    borderCollapse: 'collapse',
  },
  '& :where(button, input, optgroup, select, textarea)': {
    fontFamily: 'inherit',
    fontSize: '100%',
    fontWeight: 'inherit',
    lineHeight: 'inherit',
    color: 'inherit',
    margin: 0,
    padding: 0,
  },
  '& :where(button, select)': {
    textTransform: 'none',
  },
  '& :where(button, [type="button"], [type="reset"], [type="submit"])': {
    '-webkit-appearance': 'button',
    backgroundColor: 'transparent',
    backgroundImage: 'none',
  },
  '& :where(progress)': {
    verticalAlign: 'baseline',
  },
  '& :where([type="search"])': {
    '-webkit-appearance': 'textfield',
    outlineOffset: -2,
  },
  '& :where(summary)': {
    display: 'list-item',
  },
  '& :where(blockquote, dl, dd, h1, h2, h3, h4, h5, h6, hr, figure, p, pre)': {
    margin: 0,
  },
  '& :where(fieldset)': {
    margin: 0,
    padding: 0,
  },
  '& :where(legend)': {
    margin: 0,
    padding: 0,
  },
  '& :where(ol, ul, menu)': {
    listStyle: 'none',
    margin: 0,
    padding: 0,
  },
  '& :where(textarea)': {
    resize: 'vertical',
  },
  '& :where(input, textarea)': {
    '&::placeholder': {
      opacity: 1,
    },
  },
  '& :where(button, [role="button"])': {
    cursor: 'default',
  },
  '& :where(img, svg, video, canvas, audio, iframe, embed, object)': {
    display: 'block',
    verticalAlign: 'middle',
  },
  '& :where(img, video)': {
    maxWidth: '100%',
    height: 'auto',
  },
})

export type { VariantProps }
export type CSS = StitchesCSS<typeof config>
export type Theme = typeof theme
