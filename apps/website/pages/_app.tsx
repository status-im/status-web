import '@/styles/globals.css'

import { Provider } from '@status-im/components'
import { Inter } from 'next/font/google'

import type { AppProps } from 'next/app'

const inter = Inter({
  variable: '--font-sans',
  weight: ['400', '500', '600'],
  subsets: ['latin'],
})

export default function App({ Component, pageProps }: AppProps) {
  return (
    <div className={inter.variable}>
      <Provider>
        <Component {...pageProps} />
      </Provider>
    </div>
  )
}
