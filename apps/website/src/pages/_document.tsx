import { Children } from 'react'

import NextDocument, { Head, Html, Main, NextScript } from 'next/document'
import { AppRegistry } from 'react-native'

import Tamagui from '../../tamagui.config'

import type { DocumentContext } from 'next/document'

export default class Document extends NextDocument {
  static async getInitialProps({ renderPage }: DocumentContext) {
    AppRegistry.registerComponent('app', () => Main)
    // @ts-expect-error todo
    const { getStyleElement } = AppRegistry.getApplication('app')

    const page = await renderPage()

    const styles = [getStyleElement()]

    return { ...page, styles: Children.toArray(styles) }
  }

  render() {
    return (
      <Html lang="en">
        <Head>
          <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
          <style
            id="tamagui"
            dangerouslySetInnerHTML={{ __html: Tamagui.getCSS() }}
          />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}
