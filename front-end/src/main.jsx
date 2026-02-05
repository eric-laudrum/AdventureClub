import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import axios from 'axios';
import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyDtUyUa7uSui6fj_1V_-wb2d3sNj56ywDI",
  authDomain: "full-stack-react-3739f.firebaseapp.com",
  projectId: "full-stack-react-3739f",
  storageBucket: "full-stack-react-3739f.firebasestorage.app",
  messagingSenderId: "849259941495",
  appId: "1:849259941495:web:2ac9d4554ce61745b14072"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

axios.defaults.baseURL = import.meta.env.VITE_API_URL || '';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
