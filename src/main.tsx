import React from 'react'
import ReactDOM from 'react-dom/client'
import { HelmetProvider } from 'react-helmet-async'

import App from './App'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
     <React.StrictMode>
          <HelmetProvider> {/* Alterar o título da aba */}
               <App />
          </HelmetProvider>
     </React.StrictMode>,
)