import '../../../status.app/src/app/_styles/global.css'

import { ToastContainer } from '@status-im/components'
import { Analytics } from '@vercel/analytics/next'
import { Inter } from 'next/font/google'
import Script from 'next/script'
import { NextIntlClientProvider } from 'next-intl'

import { PlatformDetector } from '~app/_components/platform-detector'
import { Providers } from '~app/_providers'

import messages from '../../messages/en.json'
import { routing } from '../i18n/routing'
import { cloudinaryLoader } from './_components/assets/loader'

import type { Metadata } from 'next'

const GET_SITE_OG_IMAGE = cloudinaryLoader({
  src: 'get.status.app/Hero_app',
  width: 1200,
})

export const metadata: Metadata = {
  metadataBase: new URL('https://get.status.app/'),

  title: 'Status App: secure peer-to-peer private messenger',
  description:
    'Status App combines an end-to-end encrypted messenger and a secure browser into a private, decentralized ecosystem with no phone number or email required.',

  alternates: {
    canonical: './',
  },

  openGraph: {
    type: 'website',
    url: 'https://get.status.app',
    title: 'Status App: secure peer-to-peer private messenger',
    description:
      'Status App combines an end-to-end encrypted messenger and a secure browser into a private, decentralized ecosystem with no phone number or email required.',
    siteName: 'Status App',
    images: [
      {
        url: GET_SITE_OG_IMAGE,
      },
    ],
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
}

const inter = Inter({
  variable: '--font-sans',
  weight: ['400', '500', '600', '700'],
  subsets: ['latin'],
  preload: true,
})

type Props = {
  children: React.ReactNode
}

export default function RootLayout({ children }: Props) {
  const locale = routing.defaultLocale

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
          data-website-id="8916f2ff-52fc-47e9-a70f-62a50d67ce6a"
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
