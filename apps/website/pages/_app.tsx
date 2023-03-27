import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import tamaguiConfig from '../tamagui.config'
import { TamaguiProvider } from '@tamagui/core'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <TamaguiProvider config={tamaguiConfig}>
        <Component {...pageProps} />
      </TamaguiProvider>
    </>
  )
}
