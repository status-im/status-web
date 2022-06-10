import React, { StrictMode } from 'react'
import { render } from 'react-dom'

import { Community } from '@status-im/react'

const App = () => {
  return (
    <Community
      publicKey="<YOUR_COMMUNITY_KEY>"
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
