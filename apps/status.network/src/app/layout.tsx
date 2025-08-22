import { Analytics } from '@vercel/analytics/next'
import { Inter } from 'next/font/google'
import Script from 'next/script'
import './globals.css'
import { cx } from 'cva'
import { Divider } from './_components/divider'
import { Footer } from './_components/footer'
import { NavBar } from './_components/navbar'
import { NavBarMobile } from './_components/navbar-mobile'
import { Metadata } from './_metadata'

const inter = Inter({
  variable: '--font-inter',
  weight: ['200', '300', '400', '500'],
  subsets: ['latin'],
  preload: true,
})

export const metadata = Metadata({
  metadataBase: new URL('https://status.network/'),

  title: {
    default:
      'Status Network — First gasless L2 with sustainable apps funding 🐉',
    template: '%s — Status Network',
  },
  description:
    'The first natively gasless Ethereum L2 with sustainable yield and integrated public funding 🐉',

  alternates: {
    canonical: './',
  },

  twitter: {
    card: 'summary_large_image',
    site: '@StatusL2',
  },
})

type Props = {
  children: React.ReactNode
}

export default function RootLayout({ children }: Props) {
  return (
    <html lang="en">
      <body
        className={cx(
          inter.variable,
          'bg-white-100 text-neutral-100 antialiased',
          'selection:bg-purple selection:text-white-100',
        )}
        suppressHydrationWarning
      >
        <div className="relative flex min-h-screen justify-center overflow-clip px-2 pt-[65px] lg:pt-0 2xl:px-0">
          <div className="relative w-full max-w-[1418px] border-x border-neutral-20">
            <div className="absolute -left-2 top-0 z-50 h-full w-2 bg-gradient-to-r from-white-100 to-[transparent] 2xl:-left-12 2xl:w-12" />
            <div className="absolute -right-2 top-0 z-50 h-full w-2 bg-gradient-to-l from-white-100 to-[transparent] 2xl:-right-12 2xl:w-12" />
            <NavBar />
            <NavBarMobile />
            {children}
            <Divider />
            <Footer />
          </div>
        </div>
        <Analytics />
        <Script
          strategy="afterInteractive"
          src="https://umami.bi.status.im/script.js"
          data-website-id="0746c5dc-8cd3-45a4-9606-6bcf9adf248e"
          data-domains="status.network"
        />
      </body>
    </html>
  )
}
