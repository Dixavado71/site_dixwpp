import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Toaster } from 'sonner'
import App from './App.tsx'
import './index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <App />
      <Toaster 
        position="top-right"
        expand={false}
        richColors
        visibleToasts={5}
        duration={4000}
        toastOptions={{
          unstyled: true,
          classNames: {
            toast: 'toast-premium',
            success: 'toast-success',
            error: 'toast-error',
            warning: 'toast-warning',
            info: 'toast-info',
            title: 'toast-title',
            description: 'toast-description',
            closeButton: 'toast-close-button',
          },
        }}
      />
    </BrowserRouter>
  </StrictMode>,
)
