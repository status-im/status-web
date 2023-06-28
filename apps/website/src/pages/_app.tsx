import '@/styles/global.css'
import '@/styles/nav-nested-links.css'

import { ThemeProvider } from '@status-im/components'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Inter } from 'next/font/google'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { match, P } from 'ts-pattern'

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

  // const urlOrigin = process.env.VERCEL_URL
  //   ? 'https://' + process.env.VERCEL_URL
  //   : ''

  const { pathname, asPath } = useRouter()

  return (
    <>
      <Head>
        <title>Status - Private, Secure Communication</title>

        <meta name="title" content="Status - Private, Secure Communication" />
        <meta
          name="description"
          content="Status brings the power of Ethereum into your pocket by combining a messenger, crypto-wallet, and Web3 browser."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`https://status.app${asPath}`} />
        <meta
          property="og:title"
          content="Status - Private, Secure Communication"
        />
        <meta
          property="og:description"
          content="Status brings the power of Ethereum into your pocket by combining a messenger, crypto-wallet, and Web3 browser."
        />
        {/* <meta
          property="og:image"
          content={`${urlOrigin}/assets/preview/page.png`}
          key="og:image"
        /> */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@ethstatus" />
        <meta name="apple-itunes-app" content="app-id=1178893006" />
        <meta
          property="al:ios:url"
          content={`https://status.app${asPath}`}
          key="al:ios:url"
        />
        <meta property="al:ios:app_store_id" content="1178893006" />
        <meta
          property="al:ios:app_name"
          content="Status — Ethereum. Anywhere"
        />
        <meta
          property="al:android:url"
          content={`https://status.app${asPath}`}
          key="al:android:url"
        />
        <meta property="al:android:package" content="im.status.ethereum" />
        <meta
          property="al:android:app_name"
          content="Status — Ethereum. Anywhere"
        />
        <meta
          property="article:publisher"
          content="https://www.facebook.com/ethstatus"
        />
        {match(pathname)
          .with(
            P.when(p => p.startsWith('/insights')),
            () => (
              <>
                <link rel="icon" href="/assets/favicon/dev.png" />
                {/* <link rel="apple-touch-icon" href="/assets/favicon/dev.png" />
                <link
                  rel="apple-touch-icon-precomposed"
                  href="/assets/favicon/dev.png"
                /> */}
              </>
            )
          )
          .with(
            P.when(p => p.startsWith('/help')),
            () => (
              <>
                <link rel="icon" href="/assets/favicon/learn.png" />
                {/* <link rel="apple-touch-icon" href="/assets/favicon/learn.png" />
                <link
                  rel="apple-touch-icon-precomposed"
                  href="/assets/favicon/learn.png"
                /> */}
              </>
            )
          )
          .with(
            P.when(p => p.startsWith('/blog')),
            () => (
              <>
                <link rel="icon" href="/assets/favicon/blog.png" />
                {/* <link rel="apple-touch-icon" href="/assets/favicon/blog.png" />
                <link
                  rel="apple-touch-icon-precomposed"
                  href="/assets/favicon/blog.png"
                /> */}
              </>
            )
          )
          .otherwise(() => (
            <>
              <link rel="icon" href="/assets/favicon/default.png" />
              {/* <link rel="apple-touch-icon" href="/assets/favicon/default.png" />
              <link
                rel="apple-touch-icon-precomposed"
                href="/assets/favicon/default.png"
              /> */}
            </>
          ))}
      </Head>
      <div id="app" className={inter.variable + ' font-sans'}>
        <QueryClientProvider client={queryClient}>
          <ThemeProvider>
            {getLayout(<Component {...pageProps} />)}
          </ThemeProvider>
        </QueryClientProvider>
      </div>
    </>
  )
}
