import '../../styles/global.css'

import { StrictMode } from 'react'

import ReactDOM from 'react-dom/client'

import { ApprovalPage } from './approval-page'

const rootElement = document.getElementById('root')!
const root = ReactDOM.createRoot(rootElement)
root.render(
  <StrictMode>
    <ApprovalPage />
  </StrictMode>,
)
