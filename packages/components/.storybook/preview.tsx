import React from 'react'
import type { Preview } from '@storybook/react'
import { themes } from '@storybook/theming'

import { Provider, ToastContainer } from '../src'

import './reset.css'

// export const parameters: Parameters = {
//   actions: { argTypesRegex: '^on[A-Z].*' },
//   controls: {
//     matchers: {
//       color: /(background|color)$/i,
//       date: /Date$/,
//     },
//   },
// }

const preview: Preview = {
  parameters: {
    layout: 'centered',
    // darkMode: {
    //   darkClass: 'dark',
    //   lightClass: 'light',
    //   // dark: { ...themes.dark, appPreviewBg: 'pink' },
    //   // light: { ...themes.normal },
    // },
  },
  //   decorators: [
  //     Story => {
  // return      <Story />
  //       return (
  //         // <Provider>
  //           {/* <ToastContainer /> */}
  //         {/* </Provider> */}
  //       )
  //     },
  // ],
}

export default preview
