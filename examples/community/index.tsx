import React, { StrictMode } from 'react'
import { render } from 'react-dom'

import { Community } from '@status-im/react'

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
