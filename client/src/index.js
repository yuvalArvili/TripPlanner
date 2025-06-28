/* Main entry point of the React app
   Renders the App component inside the #root element in index.html
   Wraps the App in AuthProvider to provide authentication context*/
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { AuthProvider } from './context/authContext'; 

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <AuthProvider> 
      <App />
    </AuthProvider>
  </React.StrictMode>
);

// Optional performance logging
reportWebVitals();

