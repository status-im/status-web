import '@/styles/globals.css'

import { TamaguiProvider } from '@tamagui/core'

import tamaguiConfig from '../tamagui.config'

import type { AppProps } from 'next/app'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <TamaguiProvider config={tamaguiConfig}>
        <Component {...pageProps} />
      </TamaguiProvider>
    </>
  )
}
