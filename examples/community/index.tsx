import React, { StrictMode } from 'react'
import { render } from 'react-dom'

import { Community, lightTheme } from '@status-im/react'

const App = () => {
  return (
    <div>
      <Community publicKey="<YOUR_COMMUNITY_KEY>" theme={lightTheme} />
    </div>
  )
}

render(
  <StrictMode>
    <App />
  </StrictMode>,
  document.getElementById('root')
)
