import '@/styles/global.css'
import '@/styles/nav-nested-links.css'

import { ThemeProvider } from '@felicio/components'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Inter } from 'next/font/google'

import type { Page, PageLayout } from 'next'
import type { AppProps } from 'next/app'

const queryClient = new QueryClient()

const inter = Inter({
  variable: '--font-inter',
  weight: ['400', '500', '600', '700'],
  subsets: ['latin'],
})

type Props = AppProps & {
  Component: Page
}

export default function App({ Component, pageProps }: Props) {
  const getLayout: PageLayout = Component.getLayout || (page => page)

  return (
    <div id="app" className={inter.variable + ' font-sans'}>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>{getLayout(<Component {...pageProps} />)}</ThemeProvider>
      </QueryClientProvider>
    </div>
  )
}
