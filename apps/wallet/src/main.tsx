import './styles/global.css'
import '@qrkit/react/styles.css'

import { StrictMode } from 'react'

import { QRKitProvider } from '@qrkit/react'
import ReactDOM from 'react-dom/client'

import { APIClientProvider } from './providers/api-client'
import { QueryClientProvider } from './providers/query-client'
import { RouterProvider } from './providers/router'
import { StatusProvider } from './providers/status'

// if (import.meta.env.MODE !== 'production') {
//   const script = document.createElement('script')
//   script.src = 'http://localhost:8097'
//   // document.body.appendChild(script)
//   // document.documentElement.appendChild(script)
//   document.body.append(script)
// }

const rootElement = document.getElementById('root')!
if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement)
  root.render(
    <StrictMode>
      <QueryClientProvider>
        <StatusProvider>
          <APIClientProvider>
            <QRKitProvider appName="Status Wallet">
              <RouterProvider />
            </QRKitProvider>
          </APIClientProvider>
        </StatusProvider>
      </QueryClientProvider>
    </StrictMode>,
  )
}
