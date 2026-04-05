import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import axios from 'axios'
import './index.css'
import App from './App.jsx'
import {BrowserRouter } from 'react-router-dom'
import { AppContextProvider } from './context/AppContext.jsx'

const API_BASE = import.meta.env.VITE_API_URL;

axios.defaults.withCredentials = true;
if (API_BASE) {
    axios.defaults.baseURL = API_BASE;
}

createRoot(document.getElementById('root')).render(
 <BrowserRouter>
 <AppContextProvider>
  <App/>
 </AppContextProvider>
 </BrowserRouter>,
)
