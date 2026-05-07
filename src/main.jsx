import "./i18n.js";
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'

// Récupère le token passé depuis la vitrine
const params = new URLSearchParams(window.location.search);
const token = params.get("token");
const user = params.get("user");

if (token) {
  localStorage.setItem("accessToken", token);
  window.history.replaceState({}, "", "/"); // nettoie l'URL
}
if (user) {
  localStorage.setItem("user", decodeURIComponent(user));
  window.history.replaceState({}, "", "/");
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)