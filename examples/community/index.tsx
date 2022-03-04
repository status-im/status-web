import React, { StrictMode } from 'react'
import { render } from 'react-dom'

import { Community, lightTheme } from '@status-im/react'

const App = () => {
  return <Community publicKey="<YOUR_COMMUNITY_KEY>" theme={lightTheme} />
}

render(
  <StrictMode>
    <App />
  </StrictMode>,
  document.getElementById('root')
)
