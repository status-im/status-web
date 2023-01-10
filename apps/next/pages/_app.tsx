import '@tamagui/core/reset.css'
import '@tamagui/font-inter/css/400.css'
import '@tamagui/font-inter/css/700.css'

import { NextThemeProvider, useRootTheme } from '@tamagui/next-theme'
// import { Provider } from 'app/provider'
import Head from 'next/head'
import React, { useMemo } from 'react'
// import type { SolitoAppProps } from 'solito'

import tamaguiConfig from '../tamagui.config'

import 'raf/polyfill'
import { AppProps } from 'next/app'
import { TamaguiProvider } from '@tamagui/core'

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>Tamagui Example App</title>
        <meta name="description" content="Tamagui, Solito, Expo & Next.js" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <TamaguiProvider config={tamaguiConfig}>
        <Component {...pageProps} />
      </TamaguiProvider>
    </>
  )
}

// function ThemeProvider({ children }: { children: React.ReactNode }) {
//   const [theme, setTheme] = useRootTheme()

//   return (
//     <NextThemeProvider onChangeTheme={setTheme}>
//       <Provider disableRootThemeClass defaultTheme={theme}>
//         {children}
//       </Provider>
//     </NextThemeProvider>
//   )
// }

export default MyApp
