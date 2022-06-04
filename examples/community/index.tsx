import React, { StrictMode } from 'react'
import { render } from 'react-dom'

// FIXME!: fixme from; Unable to resolve path to module '@status-im/react'
import { Community } from '@status-im/react'
// TODO?: import/rename Chats, Messages, Messenger
// TODO?: import/rename CommunityAndMessenger, or Status even

const App = () => {
  return (
    <Community
      publicKey="0x029f196bbfef4fa6a5eb81dd802133a63498325445ca1af1d154b1bb4542955133"
      theme="light"
    />
  )
}

render(
  <StrictMode>
    <App />
  </StrictMode>,
  document.getElementById('root')
)
