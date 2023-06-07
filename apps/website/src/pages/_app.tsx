import '@/styles/global.css'
import '@/styles/nav-nested-links.css'

import { ThemeProvider } from '@status-im/components'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Inter } from 'next/font/google'
import Head from 'next/head'

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

  const urlOrigin = process.env.VERCEL_URL
    ? 'https://' + process.env.VERCEL_URL
    : ''

  return (
    <>
      <Head>
        {/* note: should not be in `_document.tsx` */}
        <title>Status - Private, Secure Communication</title>

        <meta name="title" content="Status - Private, Secure Communication" />
        <meta
          name="description"
          content="Status brings the power of Ethereum into your pocket by combining a messenger, crypto-wallet, and Web3 browser."
        />
        <meta property="og:type" content="website" />
        {/* fixme?: useRouter().asPath to set content */}
        {/* fixme?: use status-app:// instead of https:// because of Windows platform */}
        <meta property="og:url" content="https://status.app/" />
        <meta
          property="og:title"
          content="Status - Private, Secure Communication"
        />
        <meta
          property="og:description"
          content="Status brings the power of Ethereum into your pocket by combining a messenger, crypto-wallet, and Web3 browser."
        />
        {/* todo?: set `key` for others too */}
        <meta
          property="og:image"
          content={`${urlOrigin}/assets/preview/page.png`}
          key="og:image"
        />
        <meta property="twitter:card" content="summary_large_image" />
        <meta
          property="twitter:title"
          content="Status - Private, Secure Communication"
        />
        <meta
          property="twitter:description"
          content="Status brings the power of Ethereum into your pocket by combining a messenger, crypto-wallet, and Web3 browser."
        />
        <meta
          property="twitter:image"
          content={`%${urlOrigin}/assets/preview/page.png`}
          key="twitter:image"
        />
        <meta name="twitter:site" content="@ethstatus" />
        <meta name="apple-itunes-app" content="app-id=1178893006" />
        {/* todo?: use https instead */}
        <meta property="al:ios:url" content="status-app://" />
        <meta property="al:ios:app_store_id" content="1178893006" />
        <meta
          property="al:ios:app_name"
          content="Status — Ethereum. Anywhere"
        />
        <meta property="al:android:url" content="status-app://" />
        <meta property="al:android:package" content="im.status.ethereum" />
        <meta
          property="al:android:app_name"
          content="Status — Ethereum. Anywhere"
        />
        <meta name="msapplication-TileColor" content="#4360DF" />
        <meta
          name="msapplication-TileImage"
          content="/assets/favicon/ms-icon-144x144.png"
        />
        {/* todo?: set/point to our blog */}
        {/* <meta
          property="article:publisher"
          content="https://www.facebook.com/ethstatus"
        /> */}

        {/* todo?: add `apple-touch-icon-precomposed.png` as `link` too */}
        {/* todo?: ask if all dimensions are necessary */}
        <link
          rel="apple-touch-icon"
          sizes="57x57"
          href="/assets/favicon/apple-icon-57x57.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="60x60"
          href="/assets/favicon/apple-icon-60x60.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="72x72"
          href="/assets/favicon/apple-icon-72x72.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="76x76"
          href="/assets/favicon/apple-icon-76x76.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="114x114"
          href="/assets/favicon/apple-icon-114x114.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="120x120"
          href="/assets/favicon/apple-icon-120x120.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="144x144"
          href="/assets/favicon/apple-icon-144x144.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="152x152"
          href="/assets/favicon/apple-icon-152x152.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/assets/favicon/apple-icon-180x180.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="192x192"
          href="/assets/favicon/android-icon-192x192.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/assets/favicon/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="96x96"
          href="/assets/favicon/favicon-96x96.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/assets/favicon/favicon-16x16.png"
        />
        <link rel="manifest" href="/assets/favicon/manifest.json" />
        <link rel="icon" href="/favicon.ico" />
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
