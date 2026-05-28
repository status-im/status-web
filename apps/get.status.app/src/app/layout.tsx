import '../../../status.app/src/app/_styles/global.css'

import { ToastContainer } from '@status-im/components'
import { Analytics } from '@vercel/analytics/next'
import { Inter } from 'next/font/google'
import Script from 'next/script'
import { NextIntlClientProvider } from 'next-intl'
import { getLocale, getMessages } from 'next-intl/server'

import { PlatformDetector } from '~app/_components/platform-detector'
import { Metadata } from '~app/_metadata'
import { Providers } from '~app/_providers'

export const metadata = Metadata({
  metadataBase: new URL('https://get.status.app/'),

  title: {
    template: '%s',
    default: 'Status App: secure peer-to-peer private messenger',
  },
  description:
    'Status App combines an end-to-end encrypted messenger and a secure browser into a private, decentralized ecosystem with no phone number or email required.',

  alternates: {
    canonical: './',
  },

  appLinks: {
    ios: {
      app_store_id: '6754166924',
      app_name: 'Status - privacy super app',
      url: 'https://get.status.app',
    },
    android: {
      package: 'app.status.mobile',
      app_name: 'Status - privacy super app',
      url: 'https://get.status.app',
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
    <html lang={locale} className={inter.variable} suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://res.cloudinary.com" />
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
        <Script
          strategy="afterInteractive"
          src="https://umami.bi.status.im/script.js"
          data-website-id="785550f6-3fea-4df0-aebe-2d5a999e6d49"
          data-domains="get.status.app"
          data-exclude-hash="true"
        />
      </body>
    </html>
  )
}

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
