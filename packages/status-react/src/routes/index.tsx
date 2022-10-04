import React from 'react'

import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
  useMatch,
} from 'react-router-dom'

// import { createGlobalStyle } from 'styled-components'
import { MainSidebar } from '../components/main-sidebar'
import { AppProvider } from '../contexts/app-context'
import { DialogProvider } from '../contexts/dialog-context'
import { useTheme } from '../hooks/use-theme'
import { ProtocolProvider, useProtocol } from '../protocol'
import { Chat } from '../routes/chat'
import { /* globalCss, */ globalStyles, styled } from '../styles/config'
import { Wrapper } from '../styles/GlobalStyle'

// import { GlobalStyle } from '../styles/GlobalStyle'
import type { Config } from '../types/config'

interface Props extends Config {
  meta?: string
}

// TODO: use a better way to handle this
const Gate = (props: { children: JSX.Element }) => {
  const { client } = useProtocol()

  const { params } = useMatch(':id')!
  const chatId = params.id!

  const chat = client.community.getChat(chatId)

  if (!chat) {
    return (
      <Navigate to={`/${client.community._chats[0].uuid ?? '/'}`} replace />
    )
  }

  return props.children
}

export const Community = (props: Props) => {
  const {
    theme,
    router: Router = BrowserRouter,
    publicKey,
    environment,
    options,
  } = props

  globalStyles() // base styles
  useTheme(theme)

  return (
    <Router>
      <ProtocolProvider options={{ publicKey, environment }}>
        <AppProvider options={options}>
          <DialogProvider>
            {/* <GlobalStyle /> */}
            <Wrapper
              id="foo"
              // css={{
              //   '& a': {
              //     padding: 30,
              //   },
              // }}
            >
              <MainSidebar />
              <Routes>
                <Route
                  path="/:id"
                  element={
                    <Gate>
                      <Chat />
                    </Gate>
                  }
                />
              </Routes>
            </Wrapper>
          </DialogProvider>
        </AppProvider>
      </ProtocolProvider>
    </Router>
  )
}

export type { Props as CommunityProps }

// const globalStyles = globalCss({
//   // '*': { margin: 0, padding: 0 },
//   ':where(#foo) a': {
//     padding: 20,
//   },
//   // ':where(#foo)': {
//   //   fontFamily: 'Inter, sans-serif',
//   // },
// })

// const GlobalStyle = createGlobalStyle`
//   :where(#foo) a {
//   // #foo a {
//     padding: 20px;
//   }
// `

const _Wrapper = styled('div', {
  // base styles
  overflow: 'hidden',
  position: 'relative',
  width: '100%',
  height: '100%',
  display: 'flex',
  alignItems: 'stretch',
  background: '$background',

  /*
  margin: 0,
  // xxx!?: bare minimu for a "global" style
  fontFamily: 'Inter, sans-serif',
  // fontSize: 15,
  // lineHeight: 22,

  // lineHeight: '147%',

  // margin: 0,
  padding: 0,
  border: 0,
  verticalAlign: 'baseline',

  // todo?: move to global styles; using `globalCss`; call like `useTheme`
  // todo?: use "'> *': {" isntead
  // global styles relative to this element
  '& *': {
    boxSizing: 'border-box',
    WebkitFontSmoothing: 'antialiased',
    // '& div': { border: '3px solid black' },
    // todo: test
    '&::-webkit-scrollbar': {
      width: 0,
    },
  },

  '> div,  span,  applet,  object,  iframe,  h1,  h2,  h3,  h4, h5,  h6,  p,  blockquote,  pre,  a,  abbr,  acronym,  address,  big,  cite,  code,  del,  dfn,  em,  img,  ins,  kbd,  q,  s,  samp,  small,  strike,  strong,  sub,  sup,  tt,  var,  b,  u,  i,  center,  dl,  dt,  dd,  ol,  ul,  li,  fieldset,  form,  label,  legend,  table,  caption,  tbody,  tfoot,  thead,  tr,  th,  td,  article,  aside,  canvas,  details,  embed,  figure,  figcaption,  footer,  header,  hgroup,  menu,  nav,  output,  ruby,  section,  summary,  time,  mark,  audio,  video':
    {
      margin: 0,
      // fixme!: other styled components do not override this
      padding: 0,
      border: 0,
      verticalAlign: 'baseline',
    },

  '& article,  aside,  details,  figcaption,  figure,  footer,  header,  hgroup,  menu,  nav,  section':
    {
      display: 'block',
    },

  '& ol, ul': {
    listStyle: 'none',
  },

  '& blockquote, q': {
    quotes: 'none',
  },

  '& blockquote::before, blockquote::after, q::before, q::after': {
    content: 'none',
  },

  '& table': {
    borderCollapse: 'collapse',
    borderSpacing: 0,
  },

  '& button': {
    border: 'none',
    background: 'none',
    cursor: 'pointer',
  },

  '& a': {
    textDecoration: 'none',
    cursor: 'pointer',
  },
  */
})
