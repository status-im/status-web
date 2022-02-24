import React, { StrictMode } from 'react'
import { render } from 'react-dom'

import { GroupChat, lightTheme } from '@status-im/react'

const App = () => {
  return (
    <div>
      <GroupChat
        theme={lightTheme}
        communityKey="<YOUR_COMMUNITY_KEY>"
        config={{
          environment: '<ENVIRONMENT>',
          dappUrl: '<URL>',
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
