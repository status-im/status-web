// note: has better api, theming, 1st class?, 5x smaller, for embedding
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
  globalCss,
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

// todo?: rename to baseStyles
/**
 * Base styles
 */
export const globalStyles = globalCss({
  // our `body`
  ':where(#foo)': {
    fontFamily: 'Inter, sans-serif',
  },
  // all `body` descendents (recursive)
  // ':where(#foo *)': {},
  // selected `body` descendents (recursive)
  // ':where(#foo) a':
  // note: does not work as expected; does not respec id selector
  // ':where(#foo) div, span, applet, object, iframe, h1, h2, h3, h4, h5, h6, p, blockquote, pre, a, abbr, acronym, address, big, cite, code, del, dfn, em, img, ins, kbd, q, s, samp, small, strike, strong, sub, sup, tt, var, b, u, i, center, dl, dt, dd, ol, ul, li, fieldset, form, label, legend, table, caption, tbody, tfoot, thead, tr, th, td, article, aside, canvas, details, embed, figure, figcaption, footer, header, hgroup, menu, nav, output, ruby, section, summary, time, mark, audio, video':
  // note: works as expected
  ':where(#foo) :where(div, span, applet, object, iframe, h1, h2, h3, h4, h5, h6, p, blockquote, pre, a, abbr, acronym, address, big, cite, code, del, dfn, em, img, ins, kbd, q, s, samp, small, strike, strong, sub, sup, tt, var, b, u, i, center, dl, dt, dd, ol, ul, li, fieldset, form, label, legend, table, caption, tbody, tfoot, thead, tr, th, td, article, aside, canvas, details, embed, figure, figcaption, footer, header, hgroup, menu, nav, output, ruby, section, summary, time, mark, audio, video)':
    // note: seems to work the same as if the elements were in :where()
    // note: does not work as expected; does not respec id selector
    // ':where(#foo div, span, applet, object, iframe, h1, h2, h3, h4, h5, h6, p, blockquote, pre, a, abbr, acronym, address, big, cite, code, del, dfn, em, img, ins, kbd, q, s, samp, small, strike, strong, sub, sup, tt, var, b, u, i, center, dl, dt, dd, ol, ul, li, fieldset, form, label, legend, table, caption, tbody, tfoot, thead, tr, th, td, article, aside, canvas, details, embed, figure, figcaption, footer, header, hgroup, menu, nav, output, ruby, section, summary, time, mark, audio, video)':
    {
      // ':where(.foo a, h1, h2)': {
      // ':where(.foo) a, h1, h2': {
      // ':where(#foo a, h1, h2)': {
      // ':where(#foo) a, h1, h2': {
      margin: 0,
      padding: 20,
      border: 0,
      verticalAlign: 'baseline',
    },
})

export const base = css({
  // todo?: caniuse where()
  // todo?: nest
  ':where(&)': {
    margin: 0,
    fontFamily: 'Inter, sans-serif',
    fontSize: 15,
    // lineHeight: 22,
    lineHeight: '147%',
  },
  ':where(&) :where(*)': {
    boxSizing: 'border-box',
    '-webkit-font-smoothing': 'antialiased',
    // fixme?:
    '&::-webkit-scrollbar': {
      width: 0,
    },
  },
  ':where(&) :where(div, span, applet, object, iframe, h1, h2, h3, h4, h5, h6, p, blockquote, pre, a, abbr, acronym, address, big, cite, code, del, dfn, em, img, ins, kbd, q, s, samp, small, strike, strong, sub, sup, tt, var, b, u, i, center, dl, dt, dd, ol, ul, li, fieldset, form, label, legend, table, caption, tbody, tfoot, thead, tr, th, td, article, aside, canvas, details, embed, figure, figcaption, footer, header, hgroup, menu, nav, output, ruby, section, summary, time, mark, audio, video)':
    {
      margin: 0,
      padding: 0,
      border: 0,
      verticalAlign: 'baseline',
    },
  ':where(&) :where(article, aside, details, figcaption, figure, footer, header, hgroup, menu, nav, section)':
    {
      display: 'block',
    },
  ':where(&) :where(ol, ul)': {
    listStyle: 'none',
  },
  ':where(&) :where(blockquote, q)': {
    quotes: 'none',
  },
  // fixme?:
  ':where(&) :where(blockquote:before, blockquote:after, q:before, q:after)': {
    // content: '',
    content: 'none',
  },
  ':where(&) :where(table)': {
    borderCollapse: 'collapse',
    borderSpacing: 0,
  },
  ':where(&) :where(button)': {
    border: 'none',
    background: 'none',
    cursor: 'pointer',
  },
  ':where(&) :where(a)': {
    textDecoration: 'none',
    cursor: 'pointer',
  },
})

export type { VariantProps }
export type CSS = StitchesCSS<typeof config>
export type Theme = typeof theme
