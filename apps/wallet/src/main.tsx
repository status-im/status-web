import './styles/global.css'

import { StrictMode } from 'react'

import ReactDOM from 'react-dom/client'

import { APIClientProvider } from './providers/api-client'
import { QueryClientProvider } from './providers/query-client'
import { RouterProvider } from './providers/router'
import { StatusProvider } from './providers/status'

const rootElement = document.getElementById('root')!
if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement)
  root.render(
    <StrictMode>
      <QueryClientProvider>
        <StatusProvider>
          <APIClientProvider>
            <RouterProvider />
          </APIClientProvider>
        </StatusProvider>
      </QueryClientProvider>
    </StrictMode>,
  )
}
