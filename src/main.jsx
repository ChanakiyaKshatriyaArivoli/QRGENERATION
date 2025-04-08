import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// Set the API base URL to use localhost
const API_BASE_URL = `http://localhost:3000`; // Use localhost for the backend
console.log(`API Base URL: ${API_BASE_URL}`);

// Example fetch call to test the API
fetch(`${API_BASE_URL}/get-users`)
  .then((response) => response.json())
  .then((data) => console.log('Fetched users:', data))
  .catch((error) => console.error('Error fetching users:', error));

// Pass the API base URL to the application (if needed, via context or props)
// Example: <App apiBaseUrl={API_BASE_URL} />

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
