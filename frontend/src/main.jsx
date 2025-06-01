import { StrictMode } from 'react';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { createRoot } from 'react-dom/client'
import { AuthProvider } from './contexts/authcontext.jsx'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  // <StrictMode>
  <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
    < AuthProvider >
      <App />
    </AuthProvider>
  </GoogleOAuthProvider >

  // </StrictMode>,
)
