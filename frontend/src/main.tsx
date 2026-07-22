import { createRoot } from 'react-dom/client'
import './index.css'
import "./shared/api/interceptors";
import App from './App.tsx'
import AuthInitializer from './features/auth/components/AuthInitializer.tsx'
import { Provider } from 'react-redux'
import { store } from './app/store.ts'
import ToastProvider from './shared/components/ToastProvider.tsx'

createRoot(document.getElementById('root')!).render(

    <Provider store={store}>
      <AuthInitializer>
        <ToastProvider />
        <App />
      </AuthInitializer>
    </Provider>

)
