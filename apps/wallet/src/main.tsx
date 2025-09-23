import './styles/global.css'

import { StrictMode } from 'react'

import ReactDOM from 'react-dom/client'

import { APIClientProvider } from './providers/api-client'
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
      <StatusProvider>
        <APIClientProvider>
          <RouterProvider />
        </APIClientProvider>
      </StatusProvider>
    </StrictMode>,
  )
}
