import { Community } from '@status-im/react'

const publicKey = process.env.PUBLIC_KEY

if (!publicKey) {
  throw new Error(
    'Add PUBLIC_KEY to your environment variables (see .env.example)'
  )
}

const environment = process.env.ENVIRONMENT as 'production' | 'test'

export const App = () => {
  return (
    <Community publicKey={publicKey} environment={environment} theme="light" />
  )
}
