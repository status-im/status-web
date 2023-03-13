import '../styles/reset.css'
import '../styles/app.css'
import '@tamagui/core/reset.css'
import '@tamagui/font-inter/css/400.css'
import '@tamagui/font-inter/css/700.css'

import { StrictMode } from 'react'

import { Provider } from '@status-im/components'
import { createRoot } from 'react-dom/client'

import App from './app'

const root = document.getElementById('root') as HTMLElement

createRoot(root).render(
  <StrictMode>
    <Provider>
      <App />
    </Provider>
  </StrictMode>
)
