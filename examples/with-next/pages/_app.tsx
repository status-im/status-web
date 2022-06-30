import '../global.css'

import React from 'react'

import Head from 'next/head'

import type { AppProps } from 'next/app'

function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <link
          rel="stylesheet"
          href="https://unpkg.com/tailwindcss@3.0.0/src/css/preflight.css"
        />
      </Head>
      <Component {...pageProps} />
    </>
  )
}

export default App
