import './_styles/global.css'

import { ToastContainer } from '@status-im/components'
import { Analytics } from '@vercel/analytics/next'
import { Inter } from 'next/font/google'
import Script from 'next/script'
import { NextIntlClientProvider } from 'next-intl'
import { getLocale, getMessages } from 'next-intl/server'

import { PlatformDetector } from './_components/platform-detector'
import { Metadata } from './_metadata'
import { Providers } from './_providers'

export const metadata = Metadata({
  metadataBase: new URL('https://status.app/'),

  title: {
    template: '%s — Status',
    default: 'Status — Make the jump to web3',
  },
  description:
    'The open-source, decentralised wallet and messenger. Own your crypto and chat privately.',

  alternates: {
    canonical: './',
  },

  twitter: {
    card: 'summary_large_image',
    site: '@ethstatus',
  },

  appLinks: {
    ios: {
      app_store_id: '1178893006',
      app_name: 'Status — Ethereum. Anywhere',
      url: 'https://status.app',
    },
    android: {
      package: 'im.status.ethereum',
      app_name: 'Status — Ethereum. Anywhere',
      url: 'https://status.app',
    },
  },
})

const inter = Inter({
  variable: '--font-sans',
  weight: ['400', '500', '600', '700'],
  subsets: ['latin'],
  preload: true,
})

type Props = {
  children: React.ReactNode
}

export default async function RootLayout({ children }: Props) {
  const [locale, messages] = await Promise.all([getLocale(), getMessages()])

  return (
    <html lang={locale} className={inter.variable}>
      <head>
        <link rel="preconnect" href="https://res.cloudinary.com" />
        <meta
          property="article:publisher"
          content="https://www.facebook.com/ethstatus"
        />
      </head>
      <body data-customisation="blue" suppressHydrationWarning>
        <script
          suppressHydrationWarning
          dangerouslySetInnerHTML={{
            __html: `(${platformScript.toString()})()`,
          }}
        />
        <PlatformDetector />
        <div id="app" className="isolate">
          <NextIntlClientProvider locale={locale} messages={messages}>
            <Providers>{children}</Providers>
          </NextIntlClientProvider>
        </div>
        <ToastContainer />
        <Analytics debug={false} />
        <Analytics />
        <Script
          strategy="afterInteractive"
          src="https://umami.bi.status.im/script.js"
          data-website-id="785550f6-3fea-4df0-aebe-2d5a999e6d49"
          data-domains="status.app"
          data-exclude-hash="true"
        />
        {/* <VercelToolbar /> */}
      </body>
    </html>
  )
}

// inspired by the implementation of next-themes
// https://github.com/pacocoursey/next-themes/blob/main/next-themes/src/index.tsx
const platformScript = () => {
  const d = document.documentElement
  const userAgent = navigator.userAgent.toLowerCase()
  if (/iphone|ipad|ipod/.test(userAgent)) {
    d.setAttribute('data-platform', 'ios')
  } else if (userAgent.includes('mac')) {
    d.setAttribute('data-platform', 'macos')
  } else if (userAgent.includes('win')) {
    d.setAttribute('data-platform', 'windows')
  } else if (userAgent.includes('android')) {
    d.setAttribute('data-platform', 'android')
  } else if (userAgent.includes('linux')) {
    d.setAttribute('data-platform', 'linux')
  } else {
    d.setAttribute('data-platform', 'unknown')
  }
}
