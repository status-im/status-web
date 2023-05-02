import '@/styles/app.css'
import '@/styles/reset.css'

import { Provider } from '@status-im/components'
import { Inter } from 'next/font/google'

import type { Page, PageLayout } from 'next'
import type { AppProps } from 'next/app'

const inter = Inter({
  variable: '--font-sans',
  weight: ['400', '500', '600'],
  subsets: ['latin'],
})

type Props = AppProps & {
  Component: Page
}

export default function App({ Component, pageProps }: Props) {
  const getLayout: PageLayout = Component.getLayout || (page => page)

  return (
    <div id="app" className={inter.variable}>
      <Provider>{getLayout(<Component {...pageProps} />)}</Provider>
    </div>
  )
}
