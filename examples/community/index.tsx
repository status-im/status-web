import React, { StrictMode } from 'react'
import { render } from 'react-dom'

// FIXME!: fixme from; Unable to resolve path to module '@status-im/react'
import { Community } from '@status-im/react'
// TODO?: import/rename Chats, Messages, Messenger
// TODO?: import/rename CommunityAndMessenger, or Status even

const App = () => {
  return <Community publicKey="<YOUR_COMMUNITY_KEY>" theme="light" />
}

render(
  <StrictMode>
    <App />
  </StrictMode>,
  document.getElementById('root')
)
