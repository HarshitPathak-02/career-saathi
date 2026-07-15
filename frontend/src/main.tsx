import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import AuthInitializer from './features/auth/components/AuthInitializer.tsx'
import { Provider } from 'react-redux'
import { store } from './app/store.ts'
import ToastProvider from './shared/components/ToastProvider.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <AuthInitializer>
        <ToastProvider />
        <App />
      </AuthInitializer>
    </Provider>


  </StrictMode>,
)
