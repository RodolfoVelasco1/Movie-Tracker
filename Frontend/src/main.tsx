import { createRoot } from 'react-dom/client'
import { StrictMode } from 'react'
import './index.css'
import App from './App.tsx'
import axios from 'axios';

axios.interceptors.request.use(config => {
    const token = localStorage.getItem('token');
    if (token && !config.url?.includes('/auth/')) {
        config.headers.Authorization = `Bearer ${token}`;
    }  
    return config;
}, error => {
    return Promise.reject(error);
});

axios.interceptors.response.use(
    response => response,
    error => {
        if (error.response && (error.response.status === 403 || error.response.status === 401)) {
            localStorage.removeItem('token'); 
            if (!window.location.pathname.includes('/auth') && window.location.pathname !== '/' && window.location.pathname !== '/register') {
                 window.location.href = '/';
            }
        }
        return Promise.reject(error);
    }
);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)