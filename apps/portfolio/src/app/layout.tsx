import './_styles/global.css'

import { ToastContainer } from '@status-im/components'
import { Analytics } from '@vercel/analytics/next'
import { Inter } from 'next/font/google'

import { Navbar } from './_components/navbar'
import { NotAllowed } from './_components/not-allowed'
import { Providers } from './_providers'

import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Portfolio',
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

export default async function PortfolioLayout(props: Props) {
  const { children } = props

  return (
    <html lang="en" className={inter.variable}>
      <head>
        <link rel="preconnect" href="https://res.cloudinary.com" />
      </head>
      <body data-customisation="blue" suppressHydrationWarning>
        <div id="app" className="isolate">
          <Providers>
            <>
              <Navbar />
              <div className="px-1">
                <div className="hidden flex-1 flex-col 2md:flex xl:pb-1">
                  <div className="flex h-[calc(100vh-60px)] flex-col overflow-clip rounded-[24px] bg-white-100">
                    {children}
                  </div>
                </div>
                <NotAllowed />
                <ToastContainer />
              </div>
            </>
          </Providers>
        </div>
        <Analytics debug={false} />
        {/* <VercelToolbar /> */}
      </body>
    </html>
  )
}
