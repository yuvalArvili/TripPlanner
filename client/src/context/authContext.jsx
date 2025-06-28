import { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

// Provides authentication state and functions to the whole app
export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('token')); // Initialize token from localStorage

  const login = (newToken) => {
    localStorage.setItem('token', newToken); //  token saved in localStorage
    setToken(newToken);
  };

  const logout = () => {
    localStorage.removeItem('token'); // Remove token from localStorage
    setToken(null);
  };

  // Provide token and auth functions to children components
  // This allows components to access the token and call login/logout functions
  return (
    <AuthContext.Provider value={{ token, login, logout }}> 
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the auth context- create useAuth and than use it in other components in short way
// This allows components to easily access authentication state and functions
export const useAuth = () => useContext(AuthContext);