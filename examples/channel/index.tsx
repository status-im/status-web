import React, { StrictMode } from 'react'
import { render } from 'react-dom'

import { Channel, lightTheme } from '@status-im/react'

const App = () => {
  return (
    <div>
      <Channel
        publicKey="<YOUR_COMMUNITY_KEY>"
        theme={lightTheme}
        options={{
          showMembers: false,
        }}
      />
    </div>
  )
}

render(
  <StrictMode>
    <App />
  </StrictMode>,
  document.getElementById('root')
)
