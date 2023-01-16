import NextDocument, { Head, Html, Main, NextScript } from 'next/document'
import { Children } from 'react'
import { AppRegistry } from 'react-native'

import Tamagui from '../tamagui.config'

// TODO: the recommended approach breaks HMR when Tmaagui.getCSS() is called in the getInitialProps method.
export default class Document extends NextDocument {
  // static async getInitialProps({ renderPage }: any) {
  //   AppRegistry.registerComponent('Main', () => Main)
  //   const page = await renderPage()

  //   // @ts-ignore
  //   const { getStyleElement } = AppRegistry.getApplication('Main')

  //   /**
  //    * Note: be sure to keep tamagui styles after react-native-web styles like it is here!
  //    * So Tamagui styles can override the react-native-web styles.
  //    */
  //   const styles = [
  //     getStyleElement(),
  //     <style
  //       key="tamagui-css"
  //       dangerouslySetInnerHTML={{ __html: Tamagui.getCSS() }}
  //     />,
  //   ]

  //   return { ...page, styles: Children.toArray(styles) }
  // }

  static async getInitialProps({ renderPage }) {
    AppRegistry.registerComponent('app', () => Main)
    // @ts-ignore
    const { getStyleElement } = AppRegistry.getApplication('app')

    const page = await renderPage()

    const styles = [
      // <style dangerouslySetInnerHTML={{ __html: normalizeNextElements }} />,
      getStyleElement(),
      // <style
      //   key="tamagui-css"
      //   dangerouslySetInnerHTML={{ __html: Tamagui.getCSS() }}
      // />,
    ]

    return { ...page, styles: Children.toArray(styles) }
  }

  render() {
    return (
      <Html lang="en">
        <Head>
          <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
          <style
            id="stitches"
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
