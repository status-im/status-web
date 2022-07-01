import React from 'react'

import { Community } from '@status-im/react'

const publicKey = process.env.PUBLIC_KEY

if (!publicKey) {
  throw new Error(
    'Add PUBLIC_KEY to your environment variables (see .env.example)'
  )
}

export const App = () => {
  return <Community publicKey={publicKey} theme="light" />
}
