import '@tamagui/core/reset.css'
import '@tamagui/font-inter/css/400.css'
import '@tamagui/font-inter/css/700.css'

import '../styles/reset.css'
import '../styles/app.css'

import Head from 'next/head'
import React from 'react'

import tamaguiConfig from '../tamagui.config'

import { AppProps } from 'next/app'
import { TamaguiProvider } from '@tamagui/core'

// import { NextThemeProvider, useRootTheme } from '@tamagui/next-theme'
// import { Provider } from 'app/provider'
// import type { SolitoAppProps } from 'solito'

function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>Status</title>
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

export default App
