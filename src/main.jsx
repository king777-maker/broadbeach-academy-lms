import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.jsx'

const basename =
  typeof window !== 'undefined' &&
  window.location.pathname.startsWith('/broadbeachlearning.com')
    ? '/broadbeachlearning.com'
    : ''

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter basename={basename}>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
)
